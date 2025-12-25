import { useState } from 'react';
import { RichTextExample } from './RichTextExample';
import { LinkedItemExample } from './LinkedItemExample';
import { getUserId } from './userId';

type Tab = 'component' | 'linked-item';

const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '0.5rem 1rem',
  border: '1px solid #ccc',
  borderBottom: isActive ? '1px solid white' : '1px solid #ccc',
  borderRadius: '4px 4px 0 0',
  background: isActive ? 'white' : '#f5f5f5',
  cursor: 'pointer',
  marginRight: '0.25rem',
  fontWeight: isActive ? 'bold' : 'normal',
  position: 'relative',
  bottom: '-1px',
});

export const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('component');

  return (
    <div>
      <h1>Statsig Experiment Resolution Example</h1>
      <p>
        <strong>User ID:</strong> <code>{getUserId()}</code>
      </p>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        This example demonstrates two patterns for using experiments in Kontent.ai.
      </p>

      <div style={{ marginTop: '1rem' }}>
        <button
          type="button"
          style={tabButtonStyle(activeTab === 'component')}
          onClick={() => setActiveTab('component')}
        >
          Component in Rich Text
        </button>
        <button
          type="button"
          style={tabButtonStyle(activeTab === 'linked-item')}
          onClick={() => setActiveTab('linked-item')}
        >
          Linked Items
        </button>
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          borderRadius: '0 4px 4px 4px',
        }}
      >
        {activeTab === 'component' ? <RichTextExample /> : <LinkedItemExample />}
      </div>
    </div>
  );
};
