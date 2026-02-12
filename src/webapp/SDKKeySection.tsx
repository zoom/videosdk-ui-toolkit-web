import React, { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

export default function SDKKeySection() {
  const [sdkKey, setSdkKey] = useState("sk_live_example_key_123456789");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(sdkKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateKey = () => {
    // In a real app, this would make an API call
    setSdkKey(`sk_live_${Math.random().toString(36).substring(2, 15)}`);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SDK Keys</h2>
        <p className="text-gray-600">
          Manage your SDK Key for SDK integration. Keep these secure and never share them publicly.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <label htmlFor="sdk-key" className="block text-sm font-medium text-gray-700 mb-2">
            SDK Key
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex-1 flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg">
              <input
                type="text"
                id="sdk-key"
                value={sdkKey}
                readOnly
                className="flex-1 bg-transparent border-none focus:ring-0 font-mono text-sm text-gray-900"
              />
              <button
                onClick={copyToClipboard}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={regenerateKey}
              className="inline-flex items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </button>
          </div>
          {copied && <p className="mt-2 text-sm text-green-600">Copied to clipboard!</p>}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Important Notes:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Never share your SDK Key publicly or commit them to version control</li>
            <li>Regenerating keys will invalidate the previous key immediately</li>
            <li>Use environment variables to store keys in your application</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
