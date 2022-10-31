jQuery(document).ready( function() {
    // Save the customer account/card details for the future purchase process
    if(jQuery("#nn_toggle_form").length <= 0) {
        jQuery("#nn_load_new_form").show();
    } else {
        jQuery("#nn_load_new_form").hide();
    }               
    
    if(jQuery("input[name='nn_radio_option']").length > 0) { 
        var token = jQuery("input[name='nn_radio_option']:first").val(); 
        if(token){
            jQuery('#nn_customer_selected_token').val(token);
        } else {
            jQuery('#nn_customer_selected_token').val('');
        }
    }

    jQuery("input[name='nn_radio_option']").on('click', function () {
        var tokenValue = jQuery(this).val();
        if(tokenValue){
            jQuery('#nn_customer_selected_token').val(tokenValue);
        } else {
            jQuery('#nn_customer_selected_token').val('');
        }
        
        if(jQuery(this).attr('id') == 'nn_toggle_form') {
            jQuery("#nn_load_new_form").show();
            jQuery('#nn_customer_selected_token').val('');                
        } else {
            jQuery("#nn_load_new_form").hide();                
        }
    });
    jQuery("input[name='nn_radio_option']:first").attr("checked","checked");
});

function removePaymentDetails(token, tid)
{
    var removeSavedPaymentToken = {'token' : token, 'tid' : tid};
    removeSavedPaymentTokenRequestHandler(removeSavedPaymentToken);
}

// Remove the save card details based on the customer input
function removeSavedPaymentTokenRequestHandler(removeSavedPaymentToken) {
	// Get confirmation from customer before deleting the details
	if(confirm(jQuery('#remove_saved_payment_detail').val())) {
		if ('XDomainRequest' in window && window.XDomainRequest !== null) {
			var xdr = new XDomainRequest(); // Use Microsoft XDR
			var removeSavedPaymentToken = jQuery.param(removeSavedPaymentToken);
			xdr.open('POST', jQuery('#nn_payment_detail_removal_url').val());
			xdr.onload = function (result) {
				jQuery('#remove_'+removeSavedPaymentToken['token']).remove();
				alert(jQuery('#removed_saved_payment_detail').val());
				if (jQuery(".nn_saved_payment_detail").length == 0 ) {
				   jQuery("#nn_load_new_form").show();
				   jQuery("#nn_add_new_details").hide();
				}
			};
			xdr.onerror = function () {
				_result = false;
			};
			xdr.send(removeSavedPaymentToken);
		} else {
			jQuery.ajax(
				{
					url      : jQuery('#nn_payment_detail_removal_url').val(),
					type     : 'post',
					dataType : 'html',
					data     : removeSavedPaymentToken,
					success  : function (result) {
						jQuery('#remove_'+removeSavedPaymentToken['token']).remove();
						alert(jQuery('#removed_saved_payment_detail').val());
						if (jQuery(".nn_saved_payment_detail").length == 0 ) {
						   jQuery("#nn_load_new_form").show();
						   jQuery("#nn_add_new_details").hide();
						}
					}
				}
			);
		}
	}
}
