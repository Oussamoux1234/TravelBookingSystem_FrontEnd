// User navigation - simplified without authentication
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UserNav() {
  return (
    <Button asChild variant="ghost" size="icon">
      <Link to="/profile">
        <User className="h-5 w-5" />
        <span className="sr-only">Profile</span>
      </Link>
    </Button>
  );
}
