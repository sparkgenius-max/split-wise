import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen relative overflow-hidden">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-primary to-secondary p-8 text-white text-center relative">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <i className="fas fa-users text-3xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold">SplitEase</h1>
          <p className="text-white/90 text-lg">Expense Splitting Made Simple</p>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Split expenses with friends easily
          </h2>
          <p className="text-gray-600">
            Track balances, manage groups, and settle up with the Gen-Z expense splitting app.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <i className="fas fa-calculator text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Auto-Split</h3>
                <p className="text-sm text-gray-600">
                  Automatically divide expenses among group members
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-success text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Visual Tracking</h3>
                <p className="text-sm text-gray-600">
                  See real-time balances and transaction history
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <i className="fas fa-comments text-accent text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Group Chat</h3>
                <p className="text-sm text-gray-600">
                  Communicate about expenses within groups
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="space-y-4 pt-8">
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg"
          >
            Get Started
          </Button>
          
          <p className="text-center text-sm text-gray-500">
            Join thousands of users splitting expenses effortlessly
          </p>
        </div>
      </main>

      {/* Decorative elements */}
      <div className="absolute top-1/2 -right-8 w-32 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 -left-8 w-24 h-24 bg-gradient-to-r from-accent/10 to-success/10 rounded-full blur-xl"></div>
    </div>
  );
}
