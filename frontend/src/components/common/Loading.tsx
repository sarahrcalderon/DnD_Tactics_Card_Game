import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 215, 0, 0.1);
  border-top: 4px solid #ffd700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #7d7d91;
  margin-top: 16px;
  text-align: center;
`;

interface LoadingProps {
  text?: string;
}

export const Loading = ({ text = 'Carregando...' }: LoadingProps) => {
  return (
    <LoadingContainer>
      <div style={{ textAlign: 'center' }}>
        <Spinner />
        <LoadingText>{text}</LoadingText>
      </div>
    </LoadingContainer>
  );
};
