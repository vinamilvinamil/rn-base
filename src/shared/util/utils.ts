import { Transaction } from "@/features/transactions/domain/models/transactions";
import { format } from "date-fns";
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
export const formatPrice = (
    value: number,
    currency: string = "INR"
) : string => {
    const locale = currency === 'VND' ? "vi-VN" : undefined;
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}

export function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}
const EXPORT_WINDOW_DAYS = 30;

export async function exportTransactionsToCsv(transactions: Transaction[]) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - EXPORT_WINDOW_DAYS);
    const recentTransactions = transactions.filter(tx => new Date(tx.date) >= cutoff)
    
    const csv = buildCsv(recentTransactions);
    const filename = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    const file = new File(new Directory(Paths.document), filename);
    if(file.exists) file.delete();
    file.create();
    file.write(csv);
    if(await Sharing.isAvailableAsync()) {
        await Sharing .shareAsync(file.uri, {
            mimeType: 'text/csv',
            dialogTitle: "Export Transaction",
            UTI: "public.comma-separated-values-text"
        })
    }
    return {count: recentTransactions.length, uri: file.uri};
}

const buildCsv = (transactions: Transaction[]) => {
    const headers = [
        "Date",
        "Type",
        "Category",
        "Description",
        "Amount",
        "Input Method"
    ];
    const rows = transactions.map(tx => [
        format(new Date(tx.date), 'yyyy-MM-dd'),
        tx.type,
        tx.category,
        tx.description || '',
        tx.amount,
        tx.input_method
    ]);
    return [headers, ...rows]
    .map(row => row.map(toCsvCell).join(","))
    .join("\n")
}

const toCsvCell = (value: string | number | null) => {
    if(value === null) return '';
    const str = String(value);
    if(/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
    return "";
}