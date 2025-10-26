'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { theme } from '../../theme';
import {
  LayoutDashboard,
  Linkedin,
  Users,
  FolderKanban,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useEffect } from 'react';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.colors.bg};
`;

const Sidebar = styled.aside`
  width: 260px;
  background: white;
  border-right: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  display: flex;
  flex-direction: column;

  @media (max-width: ${theme.breakpoints.md}px) {
    width: 80px;
  }
`;

const Logo = styled.div`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 24px;
  color: ${theme.colors.brand.primary};
  margin-bottom: ${theme.spacing.xxxl};
  padding: 0 ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.md}px) {
    font-size: 20px;
    text-align: center;
  }
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const NavItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${(props) =>
    props.$active ? theme.font.weight.semibold : theme.font.weight.medium};
  color: ${(props) =>
    props.$active ? theme.colors.brand.primary : theme.colors.ink1};
  background: ${(props) => (props.$active ? theme.colors.accent : 'transparent')};
  text-decoration: none;
  cursor: pointer;
  transition: all ${theme.motion.fast};

  &:hover {
    background: ${(props) =>
      props.$active ? theme.colors.accent : 'rgba(140, 15, 72, 0.08)'};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @media (max-width: ${theme.breakpoints.md}px) {
    justify-content: center;
    span {
      display: none;
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.ink1};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${theme.motion.fast};
  margin-top: ${theme.spacing.xl};

  &:hover {
    background: rgba(140, 15, 72, 0.08);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: ${theme.breakpoints.md}px) {
    justify-content: center;
    span {
      display: none;
    }
  }
`;

const Main = styled.main`
  flex: 1;
  padding: ${theme.spacing.xxxl};
  overflow-y: auto;

  @media (max-width: ${theme.breakpoints.md}px) {
    padding: ${theme.spacing.xxl};
  }
`;

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/linkedin', label: 'LinkedIn', icon: Linkedin },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Projets', icon: FolderKanban },
  { href: '/invoices', label: 'Factures', icon: FileText },
  { href: '/settings', label: 'Paramètres', icon: Settings },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Container>
        <div style={{ margin: 'auto', textAlign: 'center' }}>Chargement...</div>
      </Container>
    );
  }

  if (!session) return null;

  return (
    <Container>
      <Sidebar>
        <Logo>Admin</Logo>
        <Nav>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              $active={pathname === item.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(item.href);
              }}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavItem>
          ))}
        </Nav>
        <LogoutButton onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
          <LogOut />
          <span>Déconnexion</span>
        </LogoutButton>
      </Sidebar>
      <Main>{children}</Main>
    </Container>
  );
}
