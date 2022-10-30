jQuery(document).ready( function() {
    // Restrict the special characters in the IBAN field
    jQuery('#nn_sepa_iban').on('input',function ( event ) {
        let iban = jQuery(this).val().replace( /[^a-zA-Z0-9]+/g, "" ).replace( /\s+/g, "" );
        jQuery(this).val(iban);
    });
    // After the form submission disable the action
    jQuery('#novalnet_form').on('submit',function(){
        jQuery('#novalnet_form_btn').attr('disabled',true);
    });
    // Save account details process
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
