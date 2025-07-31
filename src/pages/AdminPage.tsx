import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AdminMenuList } from '@/components/admin/AdminMenuList';
import { useMenuData } from '@/hooks/useMenuData';
import { useAdmin } from '@/context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, LogOut, Download, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const {
    isAdmin,
    logout
  } = useAdmin();
  const {
    menuItems,
    loading,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    resetToDefaults,
    syncWithGitHub,
    getMenuStats,
    exportMenuForGitHub,
    lastSync
  } = useMenuData();

  const handleExportForGitHub = () => {
    const data = exportMenuForGitHub();
    alert(`✅ Menu data exported! 
    
📋 Next Steps:
1. Upload the downloaded 'menu-data.json' file to your GitHub repository
2. Replace the file at: public/menu-data.json
3. Commit and push the changes
4. All users will see the updated menu within 30 seconds!`);
  };

  const handleSyncNow = async () => {
    await syncWithGitHub();
    alert('✅ Menu synced with GitHub!');
  };

  const stats = getMenuStats();

  // Redirect if not admin (in production, you'd want proper authentication)
  if (!isAdmin) {
    return <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You need admin privileges to access this page.
              </p>
              <div className="flex gap-2">
                <Link to="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
                <Link to="/menu" className="flex-1">
                  <Button className="w-full bg-gradient-primary">
                    View Menu
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>;
  }
  if (loading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-muted-foreground">Loading menu items...</div>
          </div>
        </main>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="bg-gradient-primary text-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <Button variant="destructive" size="sm" onClick={logout} className="bg-red-600 hover:bg-red-700">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <p className="text-white/90 mb-4">
            Manage your restaurant menu items. Changes are shared with all users via GitHub.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link to="/menu">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm" className="border-white hover:bg-white/10 text-slate-950">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportForGitHub}
              className="border-white hover:bg-white/10 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export for GitHub
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSyncNow}
              disabled={loading}
              className="border-white hover:bg-white/10 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Sync Now
            </Button>
          </div>
        </div>

        {/* Sync Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Sync Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Last synced: {lastSync ? lastSync.toLocaleString() : 'Never'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Auto-syncs every 30 seconds
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">✅ Live Sync</div>
                <div className="text-xs text-muted-foreground">All users see updates</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">📊 Menu Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalItems}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{stats.offers}</div>
                <div className="text-sm text-muted-foreground">Offers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.vegItems}</div>
                <div className="text-sm text-muted-foreground">Veg Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">🚀 How to Update Menu for All Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              After making changes to the menu, follow these steps to update for all users:
            </p>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Make your changes (add/edit/delete items)</li>
              <li>Click <strong>"Export for GitHub"</strong> to download the updated menu data</li>
              <li>Upload the downloaded file to your GitHub repository at <code>public/menu-data.json</code></li>
              <li>Commit and push the changes</li>
              <li>All users will see the updated menu within 30 seconds!</li>
            </ol>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> This approach ensures all users worldwide see the same updated menu instantly!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Menu Management */}
        <AdminMenuList menuItems={menuItems} onAddItem={addMenuItem} onUpdateItem={updateMenuItem} onDeleteItem={deleteMenuItem} onResetToDefaults={resetToDefaults} />
      </main>

      <Footer />
    </div>;
};

export default AdminPage;