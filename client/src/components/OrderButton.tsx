import { useMemo } from 'react';

interface OrderButtonProps {
  order: 'ASC' | 'DESC';
}

function OrderButton({ order }: OrderButtonProps) {
  const [arrow, props] = useMemo<[string, React.CSSProperties]>(() => {
    if (order === 'ASC') {
      return ['⮝', { transform: 'translateY(1px)' }];
    } else {
      return ['⮟', {}];
    }
  }, [order]);

  return <span style={props}>{arrow}</span>;
}

export default OrderButton;
