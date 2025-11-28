import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl font-bold mb-4 text-gray-900">AcneAI</h1>
        <p className="text-lg text-gray-600 mb-8">
          Smart AI-powered acne detection and personalized skincare recommendations.
        </p>
        <Button className="px-8 py-4 text-lg rounded-2xl shadow-md bg-indigo-600 hover:bg-indigo-700">
          Get Started
        </Button>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full"
      >
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Upload className="mx-auto mb-4 w-12 h-12 text-indigo-600" />
            <h2 className="text-xl font-semibold mb-2">1. Upload Image</h2>
            <p className="text-gray-600">
              Upload a clear face photo for accurate acne detection.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">2. AI Analysis</h2>
            <p className="text-gray-600">
              Our model processes the image and identifies acne types & severity.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">3. Get Results</h2>
            <p className="text-gray-600">
              View personalized skin insights and recommended treatments.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default App;
