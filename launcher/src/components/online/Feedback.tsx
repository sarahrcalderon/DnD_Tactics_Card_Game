import { Button } from '../common/Button';
import { Notice, Row } from '../../styles/onlineStyles';

export function Feedback({
  error,
  loading,
  retry,
}: {
  error?: string;
  loading?: boolean;
  retry?: () => void;
}) {
  if (error) {
    return (
      <Notice $error role="alert">
        <Row>
          {error}
          {retry && (
            <Button $tone="quiet" onClick={retry}>
              Tentar novamente
            </Button>
          )}
        </Row>
      </Notice>
    );
  }

  if (loading) {
    return (
      <Notice role="status">Consultando os registros da expedição…</Notice>
    );
  }

  return null;
}
