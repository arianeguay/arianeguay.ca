'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme';
import { Copy, RefreshCw, Plus } from 'lucide-react';

const Container = styled.div`
  max-width: 1200px;
`;

const Header = styled.header`
  margin-bottom: ${theme.spacing.xxxl};
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

const Tabs = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.xxxl};
`;

const Tab = styled.button<{ $active?: boolean }>`
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${theme.font.weight.semibold};
  color: ${(props) =>
    props.$active ? theme.colors.brand.primary : theme.colors.ink2};
  background: none;
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  cursor: pointer;
  position: relative;
  transition: color ${theme.motion.fast};

  &:hover {
    color: ${theme.colors.brand.primary};
  }

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${theme.colors.brand.primary};
    }
  `}
`;

const Card = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.sm};
  margin-bottom: ${theme.spacing.xxl};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Label = styled.label`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
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

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  color: ${theme.colors.ink1};
  background: white;
  resize: vertical;
  transition: border-color ${theme.motion.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.brand.primary};
  }
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
  justify-content: center;
  transition: background ${theme.motion.fast};

  &:hover:not(:disabled) {
    background: ${theme.colors.brand.primaryAlt};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${theme.colors.brand.primary};
  border: 2px solid ${theme.colors.brand.primary};

  &:hover:not(:disabled) {
    background: rgba(140, 15, 72, 0.05);
  }
`;

const ToneSelector = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const ToneButton = styled.button<{ $active?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${(props) =>
    props.$active ? theme.colors.brand.primary : 'white'};
  color: ${(props) => (props.$active ? 'white' : theme.colors.ink1)};
  border: 2px solid
    ${(props) =>
      props.$active ? theme.colors.brand.primary : theme.colors.border};
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

const CommentBox = styled.div`
  background: ${theme.colors.bg};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const CommentText = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 15px;
  line-height: 1.6;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.md};
  white-space: pre-wrap;
`;

const CommentActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const IconButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: white;
  color: ${theme.colors.ink1};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  font-family: ${theme.font.family.body};
  font-size: 13px;
  font-weight: ${theme.font.weight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  transition: all ${theme.motion.fast};

  &:hover {
    background: ${theme.colors.bg};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export default function LinkedInPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'generate'>('posts');
  const [postUrl, setPostUrl] = useState('');
  const [postSnippet, setPostSnippet] = useState('');
  const [selectedTone, setSelectedTone] = useState<'professional' | 'friendly' | 'playful'>('professional');
  const [generatedComments, setGeneratedComments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to database
    console.log('Add post:', { postUrl, postSnippet });
    setPostUrl('');
    setPostSnippet('');
  };

  const handleGenerateComments = async () => {
    setLoading(true);
    // TODO: Call OpenAI API
    setTimeout(() => {
      setGeneratedComments([
        "Excellent point ! J'ai aussi remarqué cette tendance dans mes projets récents. La clé est vraiment de rester flexible et d'écouter les besoins des clients. 💡",
        "Merci pour ce partage inspirant ! Ces conseils vont vraiment m'aider dans mes prochaines collaborations. 🙌",
        "Totalement d'accord ! C'est exactement ce que j'applique dans ma pratique quotidienne. Super article ! 👏",
      ]);
      setLoading(false);
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Show toast notification
  };

  return (
    <Container>
      <Header>
        <Title>LinkedIn Assistant</Title>
      </Header>

      <Tabs>
        <Tab
          $active={activeTab === 'posts'}
          onClick={() => setActiveTab('posts')}
        >
          Mes posts
        </Tab>
        <Tab
          $active={activeTab === 'generate'}
          onClick={() => setActiveTab('generate')}
        >
          Générer des commentaires
        </Tab>
      </Tabs>

      {activeTab === 'posts' && (
        <Card>
          <SectionTitle>Ajouter un post LinkedIn</SectionTitle>
          <Form onSubmit={handleAddPost}>
            <div>
              <Label htmlFor="url">URL du post</Label>
              <Input
                id="url"
                type="url"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://www.linkedin.com/posts/..."
              />
            </div>

            <div>
              <Label htmlFor="snippet">Extrait du post (optionnel)</Label>
              <TextArea
                id="snippet"
                value={postSnippet}
                onChange={(e) => setPostSnippet(e.target.value)}
                placeholder="Collez un extrait du contenu du post..."
              />
            </div>

            <Button type="submit">
              <Plus />
              Ajouter le post
            </Button>
          </Form>
        </Card>
      )}

      {activeTab === 'generate' && (
        <>
          <Card>
            <SectionTitle>Générer des commentaires</SectionTitle>
            
            <div style={{ marginBottom: theme.spacing.xl }}>
              <Label>Ton</Label>
              <ToneSelector>
                <ToneButton
                  $active={selectedTone === 'professional'}
                  onClick={() => setSelectedTone('professional')}
                >
                  Professionnel
                </ToneButton>
                <ToneButton
                  $active={selectedTone === 'friendly'}
                  onClick={() => setSelectedTone('friendly')}
                >
                  Amical
                </ToneButton>
                <ToneButton
                  $active={selectedTone === 'playful'}
                  onClick={() => setSelectedTone('playful')}
                >
                  Enjoué
                </ToneButton>
              </ToneSelector>
            </div>

            <Button onClick={handleGenerateComments} disabled={loading}>
              {loading ? (
                'Génération en cours...'
              ) : (
                <>
                  <RefreshCw />
                  Générer 3 commentaires
                </>
              )}
            </Button>
          </Card>

          {generatedComments.length > 0 && (
            <Card>
              <SectionTitle>Commentaires générés</SectionTitle>
              {generatedComments.map((comment, index) => (
                <CommentBox key={index}>
                  <CommentText>{comment}</CommentText>
                  <CommentActions>
                    <IconButton onClick={() => handleCopy(comment)}>
                      <Copy />
                      Copier
                    </IconButton>
                  </CommentActions>
                </CommentBox>
              ))}
              <SecondaryButton onClick={handleGenerateComments} disabled={loading}>
                <RefreshCw />
                Régénérer
              </SecondaryButton>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}
