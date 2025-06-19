
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, User, LogOut, Plus } from 'lucide-react';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className={`${transparent ? 'absolute top-0 left-0 right-0 z-50 bg-transparent' : 'border-b bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className={`h-8 w-8 ${transparent ? 'text-white' : 'text-blue-600'}`} />
            <span className={`text-xl font-bold ${transparent ? 'text-white' : 'text-gray-900'}`}>StayFinder</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/host">
                  <Button variant={transparent ? "secondary" : "outline"} size="sm" className={transparent ? 'bg-white/90 text-gray-900 hover:bg-white' : ''}>
                    <Plus className="h-4 w-4 mr-2" />
                    Host
                  </Button>
                </Link>
                <Button 
                  variant={transparent ? "secondary" : "ghost"} 
                  size="sm" 
                  className={transparent ? 'bg-white/90 text-gray-900 hover:bg-white' : ''}
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant={transparent ? "secondary" : "ghost"} size="sm" className={transparent ? 'bg-white/90 text-gray-900 hover:bg-white' : ''}>
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className={transparent ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
