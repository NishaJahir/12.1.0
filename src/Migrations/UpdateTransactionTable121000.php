<?php
/**
 * This file is used for updating custom table
 *
 * @author       Novalnet AG
 * @copyright(C) Novalnet
 * @license      https://www.novalnet.de/payment-plugins/kostenlos/lizenz
 */
namespace Novalnet\Migrations;

use Novalnet\Models\TransactionLog;
use Plenty\Modules\Plugin\DataBase\Contracts\Migrate;

/**
 * Class UpdateTransactionTable121000
 *
 * @package Novalnet\Migrations
 */
class UpdateTransactionTable1210000
{
    /**
     * Create transaction log table
     *
     * @param Migrate $migrate
     */
    public function run(Migrate $migrate)
    {
        $migrate->updateTable(TransactionLog::class);
    }
}
