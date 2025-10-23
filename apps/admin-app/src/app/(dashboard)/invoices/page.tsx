'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme';
import { Plus, FileText, Download } from 'lucide-react';
import type { Invoice, InvoiceStatus } from '../../../types/database';

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

const StatusFilters = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xxl};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${(props) => (props.$active ? theme.colors.brand.primary : 'white')};
  color: ${(props) => (props.$active ? 'white' : theme.colors.ink1)};
  border: 2px solid ${(props) => (props.$active ? theme.colors.brand.primary : theme.colors.border)};
  border-radius: ${theme.radius.pill};
  font-family: ${theme.font.family.body};
  font-size: 14px;
  font-weight: ${theme.font.weight.medium};
  cursor: pointer;
  transition: all ${theme.motion.fast};

  &:hover {
    border-color: ${theme.colors.brand.primary};
  }
`;

const InvoicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const InvoiceCard = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow ${theme.motion.fast};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

const InvoiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.lg};
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.sm}px) {
    flex-direction: column;
  }
`;

const InvoiceNumber = styled.h3`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
`;

const ClientName = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${theme.colors.ink2};
`;

const InvoiceActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

const StatusBadge = styled.span<{ $status: InvoiceStatus }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.pill};
  font-size: 13px;
  font-weight: ${theme.font.weight.medium};
  background: ${(props) => {
    switch (props.$status) {
      case 'paid':
        return theme.colors.status.success;
      case 'sent':
      case 'viewed':
        return theme.colors.status.info;
      case 'overdue':
        return theme.colors.status.error;
      case 'partially_paid':
        return theme.colors.status.warning;
      default:
        return theme.colors.border;
    }
  }};
  color: white;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
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
    width: 18px;
    height: 18px;
  }
`;

const InvoiceMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.lg};
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const MetaLabel = styled.span`
  font-family: ${theme.font.family.body};
  font-size: 12px;
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.ink2};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.span`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.ink1};
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

const statusLabels: Record<InvoiceStatus | 'all', string> = {
  all: 'Toutes',
  draft: 'Brouillon',
  sent: 'Envoyée',
  viewed: 'Vue',
  partially_paid: 'Partiellement payée',
  paid: 'Payée',
  overdue: 'En retard',
  cancelled: 'Annulée',
};

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

  // Demo data
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      number: '2025-001',
      issue_date: '2025-01-15',
      due_date: '2025-02-14',
      status: 'sent',
      items: [
        { desc: 'Développement site web', qty: 1, unitPrice: 5000 },
        { desc: 'Design UI/UX', qty: 1, unitPrice: 2500 },
      ],
      subtotal: 7500,
      tax_tps: 375,
      tax_tvq: 748.13,
      total: 8623.13,
      currency: 'CAD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      number: '2025-002',
      issue_date: '2025-01-20',
      due_date: '2025-02-19',
      status: 'paid',
      items: [{ desc: 'Consultation technique', qty: 8, unitPrice: 150 }],
      subtotal: 1200,
      tax_tps: 60,
      tax_tvq: 119.70,
      total: 1379.70,
      currency: 'CAD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const filteredInvoices =
    statusFilter === 'all'
      ? invoices
      : invoices.filter((inv) => inv.status === statusFilter);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Factures</Title>
          <Subtitle>Créez et gérez vos factures</Subtitle>
        </HeaderContent>
        <Button>
          <Plus />
          Nouvelle facture
        </Button>
      </Header>

      <StatusFilters>
        {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((status) => (
          <FilterButton
            key={status}
            $active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
          >
            {statusLabels[status]}
          </FilterButton>
        ))}
      </StatusFilters>

      {filteredInvoices.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FileText size={64} color={theme.colors.ink2} />
          </EmptyIcon>
          <EmptyTitle>Aucune facture trouvée</EmptyTitle>
          <EmptyText>
            {statusFilter === 'all'
              ? 'Commencez par créer votre première facture'
              : `Aucune facture avec le statut "${statusLabels[statusFilter]}"`}
          </EmptyText>
          {statusFilter === 'all' && (
            <Button>
              <Plus />
              Créer une facture
            </Button>
          )}
        </EmptyState>
      ) : (
        <InvoicesList>
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id}>
              <InvoiceHeader>
                <div>
                  <InvoiceNumber>Facture #{invoice.number}</InvoiceNumber>
                  {invoice.client && (
                    <ClientName>{invoice.client.name}</ClientName>
                  )}
                </div>
                <InvoiceActions>
                  <StatusBadge $status={invoice.status}>
                    {statusLabels[invoice.status]}
                  </StatusBadge>
                  <IconButton title="Télécharger PDF">
                    <Download />
                  </IconButton>
                </InvoiceActions>
              </InvoiceHeader>

              <InvoiceMeta>
                <MetaItem>
                  <MetaLabel>Date d'émission</MetaLabel>
                  <MetaValue>
                    {new Date(invoice.issue_date).toLocaleDateString('fr-CA')}
                  </MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Date d'échéance</MetaLabel>
                  <MetaValue>
                    {new Date(invoice.due_date).toLocaleDateString('fr-CA')}
                  </MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Sous-total</MetaLabel>
                  <MetaValue>
                    {new Intl.NumberFormat('fr-CA', {
                      style: 'currency',
                      currency: invoice.currency,
                    }).format(invoice.subtotal)}
                  </MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Total (TPS + TVQ)</MetaLabel>
                  <MetaValue>
                    {new Intl.NumberFormat('fr-CA', {
                      style: 'currency',
                      currency: invoice.currency,
                    }).format(invoice.total)}
                  </MetaValue>
                </MetaItem>
              </InvoiceMeta>
            </InvoiceCard>
          ))}
        </InvoicesList>
      )}
    </Container>
  );
}
