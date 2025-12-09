import React from 'react';

export default function DataTable({ data, city }) {
    if (!data) return null;

    // extract properties we want to show
    const rows = data.features.map((feature) => feature.properties);

    // CSV Download Function
    const downloadCSV = () => {
        if (!rows.length) return;

        // define columns
        const headers = ["DISTRICT", "TOTAL", "WHITE", "BLACK", "HISPANIC", "ASIAN"];

        // convert data to CSV string
        const csvContent = [
            headers.join(","), // header row
            ...rows.map(row =>
                headers.map(header => {
                    // handle commas inside data by wrapping in quotes
                    const val = row[header] ?? 0; // default to 0 if missing
                    return `"${val}"`;
                }).join(",")
            )
        ].join("\n");

        // create a blob and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${city.name.replace(/, /g, "_")}_demographics.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full max-w-5xl mt-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">District Data: {city.name}</h3>
                <button
                    onClick={downloadCSV}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download CSV
                </button>
            </div>

            <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pop</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">White</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Black</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hispanic</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Asian</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.DISTRICT}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{row.TOTAL.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{row.WHITE.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{row.BLACK.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{row.HISPANIC.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{row.ASIAN.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}