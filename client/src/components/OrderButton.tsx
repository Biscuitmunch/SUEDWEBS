import { useMemo } from 'react';
import { Order } from './Trackers/DeathCount';
import { type OrderType } from './Trackers/DeathCount';

interface OrderButtonProps {
  order: OrderType;
  updated: boolean;
}

function OrderButton({ order, updated }: OrderButtonProps) {
  const [arrow, props] = useMemo<[string, React.CSSProperties]>(() => {
    if (order === Order.Ascending) {
      if (updated) {
        return ['⮝', { color: 'var(--ctp-red)' }];
      } else {
        {
          return ['⮝', {}];
        }
      }
    }
    if (updated) {
      return ['⮟', { color: 'var(--ctp-red)' }];
    } else {
      {
        return ['⮟', {}];
      }
    }
  }, [order, updated]);

  return <span style={props}>{arrow}</span>;
}

export default OrderButton;
