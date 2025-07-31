import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AdminMenuList } from '@/components/admin/AdminMenuList';
import { useMenuData } from '@/hooks/useMenuData';
import { useAdmin } from '@/context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, LogOut, Save, BarChart3 } from 'lucide-react';
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
    saveAsDefault,
    getMenuStats
  } = useMenuData();

  const handleSaveAsDefault = () => {
    const confirmed = window.confirm(
      'Save current menu as default? This will make all users see this updated menu.'
    );
    if (confirmed) {
      saveAsDefault();
    }
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
            Manage your restaurant menu items. Add, edit, or remove items from your menu.
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
              onClick={handleSaveAsDefault}
              className="border-white hover:bg-white/10 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Default
            </Button>
          </div>
        </div>

        {/* Menu Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              Menu Statistics
            </CardTitle>
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

        {/* Simple Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">💡 How to Update Menu for All Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              After making changes to the menu, click <strong>"Save as Default"</strong> to make the changes visible to all users.
            </p>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ <strong>Simple:</strong> Just click "Save as Default" and all users will see your updated menu!
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