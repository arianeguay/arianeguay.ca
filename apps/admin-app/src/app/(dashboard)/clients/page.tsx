'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import type { Client } from '../../../types/database';

const Container = styled.div`
  max-width: 1400px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.xxxl};
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 44px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  color: ${theme.colors.ink2};
`;

const Button = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xxl};
  background: ${theme.colors.brand.primary};
  color: white;
  border: none;
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${theme.font.weight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: background ${theme.motion.fast};

  &:hover {
    background: ${theme.colors.brand.primaryAlt};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: ${theme.spacing.xxl};
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.lg};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.ink2};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.xxxxl};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  color: ${theme.colors.ink1};
  background: white;
  transition: border-color ${theme.motion.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.brand.primary};
  }
`;

const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.xl};
`;

const ClientCard = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow ${theme.motion.fast};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

const ClientHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.lg};
`;

const ClientName = styled.h3`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
`;

const ClientCompany = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${theme.colors.ink2};
`;

const ClientActions = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.ink2};
  cursor: pointer;
  transition: all ${theme.motion.fast};

  &:hover {
    background: ${theme.colors.bg};
    border-color: ${theme.colors.brand.primary};
    color: ${theme.colors.brand.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const InfoRow = styled.div`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${theme.colors.ink2};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  strong {
    color: ${theme.colors.ink1};
    font-weight: ${theme.font.weight.medium};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxxxl} ${theme.spacing.xxl};
  background: white;
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.xl};
`;

const EmptyTitle = styled.h3`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.md};
`;

const EmptyText = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  color: ${theme.colors.ink2};
  margin-bottom: ${theme.spacing.xl};
`;

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Demo data - will be replaced with actual data from database
  const [clients] = useState<Client[]>([
    {
      id: '1',
      name: 'Marie Tremblay',
      email: 'marie@example.com',
      phone: '514-555-0123',
      company_name: 'Studio Design Inc.',
      tax_number_tps: '123456789',
      tax_number_tvq: '987654321',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Clients</Title>
          <Subtitle>Gérez vos clients et leurs informations</Subtitle>
        </HeaderContent>
        <Button>
          <Plus />
          Nouveau client
        </Button>
      </Header>

      <SearchBar>
        <SearchIcon>
          <Search />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Rechercher un client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>

      {filteredClients.length === 0 ? (
        <EmptyState>
          <EmptyIcon>👥</EmptyIcon>
          <EmptyTitle>Aucun client trouvé</EmptyTitle>
          <EmptyText>
            {searchQuery
              ? 'Essayez une autre recherche'
              : 'Commencez par ajouter votre premier client'}
          </EmptyText>
          {!searchQuery && (
            <Button>
              <Plus />
              Ajouter un client
            </Button>
          )}
        </EmptyState>
      ) : (
        <ClientsGrid>
          {filteredClients.map((client) => (
            <ClientCard key={client.id}>
              <ClientHeader>
                <div>
                  <ClientName>{client.name}</ClientName>
                  {client.company_name && (
                    <ClientCompany>{client.company_name}</ClientCompany>
                  )}
                </div>
                <ClientActions>
                  <IconButton title="Modifier">
                    <Edit />
                  </IconButton>
                  <IconButton title="Supprimer">
                    <Trash2 />
                  </IconButton>
                </ClientActions>
              </ClientHeader>

              <ClientInfo>
                {client.email && (
                  <InfoRow>
                    <strong>Email:</strong> {client.email}
                  </InfoRow>
                )}
                {client.phone && (
                  <InfoRow>
                    <strong>Tél:</strong> {client.phone}
                  </InfoRow>
                )}
                {client.tax_number_tps && (
                  <InfoRow>
                    <strong>TPS:</strong> {client.tax_number_tps}
                  </InfoRow>
                )}
              </ClientInfo>
            </ClientCard>
          ))}
        </ClientsGrid>
      )}
    </Container>
  );
}
