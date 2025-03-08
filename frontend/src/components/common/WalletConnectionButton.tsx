'use client';
import React, { useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useConnect } from 'wagmi';

const WalletConnectionButton: React.FC = () => {
  const { connect, connectors, isPending: connectLoading } = useConnect();
  const [selectedConnector, setSelectedConnector] = useState<string>('');

  if (!connectors || connectors.length === 0) return null;

  // showing a simple button if there's only one connector.
  if (connectors.length === 1) {
    return (
      <Button
        key={connectors[0].id}
        onClick={() => connect({ connector: connectors[0] })}
        disabled={connectLoading}
        variant='contained'
      >
        {connectors[0].name}
        {connectLoading && ' (connecting)'}
      </Button>
    );
  }

  // For multiple connectors, show a dropdown and a Connect button.
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedConnector(event.target.value);
  };

  const handleConnect = () => {
    const connector = connectors.find((c) => c.id === selectedConnector);
    if (connector) {
      connect({ connector });
    }
  };

  return (
    <>
      <FormControl variant='outlined' size='small'>
        <InputLabel id='connector-select-label'>Select Wallet</InputLabel>
        <Select
          labelId='connector-select-label'
          id='connector-select'
          value={selectedConnector}
          onChange={handleSelectChange}
          label='Select Wallet'
          sx={{ minWidth: 150 }}
        >
          {connectors.map((connector) => (
            <MenuItem key={connector.id} value={connector.id}>
              {connector.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        onClick={handleConnect}
        disabled={connectLoading || !selectedConnector}
        variant='contained'
        sx={{ ml: 2 }}
      >
        Connect
        {connectLoading && ' (connecting)'}
      </Button>
    </>
  );
};

export default WalletConnectionButton;
