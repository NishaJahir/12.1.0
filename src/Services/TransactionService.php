<?php
/**
 * This file is used for updating transaction data in the
 * Novalnet custom transactionLog table
 *
 * @author       Novalnet AG
 * @copyright(C) Novalnet
 * @license      https://www.novalnet.de/payment-plugins/kostenlos/lizenz
 */
namespace Novalnet\Services;

use Novalnet\Models\TransactionLog;
use Plenty\Modules\Plugin\DataBase\Contracts\DataBase;
use Plenty\Modules\Plugin\DataBase\Contracts\Query;
use Plenty\Plugin\Log\Loggable;

/**
 * Class TransactionService
 *
 * @package Novalnet\Services
 */
class TransactionService
{
    use Loggable;

    /**
     * Save data in transaction table
     *
     * @param $transactionData
     *
     * @return none
     */
    public function saveTransaction($transactionData)
    {
        try {
            $database = pluginApp(DataBase::class);
            $transaction = pluginApp(TransactionLog::class);
            $transaction->orderNo             = $transactionData['order_no'];
            $transaction->amount              = $transactionData['amount'];
            $transaction->callbackAmount      = $transactionData['callback_amount'];
            $transaction->referenceTid        = $transactionData['ref_tid'];
            $transaction->transactionDatetime = date('Y-m-d H:i:s');
            $transaction->tid                 = $transactionData['tid'];
            $transaction->paymentName         = $transactionData['payment_name'];
            $transaction->customerEmail       = $transactionData['customer_email'];
            $transaction->saveOneTimeToken    = $transactionData['save_onetime_token'];
            $transaction->tokenInfo           = $transactionData['token_info'];
            $transaction->additionalInfo      = !empty($transactionData['additional_info']) ? $transactionData['additional_info'] : '0';
            
            $this->getLogger(__METHOD__)->error('save db', $transaction);
            $database->save($transaction);
        } catch (\Exception $e) {
            $this->getLogger(__METHOD__)->error('Callback table insert failed!.', $e);
        }
    }

    /**
     * Retrieve transaction log table data
     *
     * @param string $key
     * @param mixed  $value
     *
     * @return array
     */
    public function getTransactionData($key, $value)
    {
        $database = pluginApp(DataBase::class);
        $order    = $database->query(TransactionLog::class)->where($key, '=', $value)->get();
        return $order;
    }

    /**
     * Update the transaction log table data
     *
     * @param string $key
     * @param mixed  $value
     * @param array $transactionData
     *
     * return none
     */
    public function updateTransactionData($key, $value, $transactionData)
    {
        $database = pluginApp(DataBase::class);
        $orderDetails = $database->query(TransactionLog::class)->where($key, '=', $value)->get();
        foreach($orderDetails as $orderDetail) {
            $additionalInfo = json_decode($orderDetail->additionalInfo, true);
            $additionalInfo['due_date']     = $transactionData['transaction']['due_date'];
            $orderDetail->amount            = $transactionData['transaction']['amount'];
            $orderDetail->additionalInfo    = json_encode($additionalInfo);
        }
        $database->save($orderDetail);
    }
    
    /**
     * Delete payment token from the database table
     *
     * @param array $requestPostData
     */
    public function removeSavedPaymentDetails($requestPostData) 
    {
        try {
            $database = pluginApp(DataBase::class);
            $orderDetails = $database->query(TransactionLog::class)->where('tid', '=', $requestPostData['tid'])->get();
            foreach($orderDetails as $orderDetail) {
                $orderDetail->saveOneTimeToken = 0;
                $orderDetail->tokenInfo = '';    
            }
            $database->save($orderDetail);
		    $updatedView = $database->query(TransactionLog::class)->where('tid', '=', $requestPostData['tid'])->get();
		    $this->getLogger(__METHOD__)->error('After removed the data', $updatedView);
        } catch (\Exception $e) {
            $this->getLogger(__METHOD__)->error('Removal of payment token failed!.', $e);
        }
    }
}
