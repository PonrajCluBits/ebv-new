import React from 'react';

import { Chip } from '@mui/material';

const StatusBadge = ({ status }) => {
  let chipColor = '';
  let chipLabel = '';
  let chipBackgroundColor = '';

  // Determine chip color and label based on status
  switch (status) {
    case 'Allocated':
      chipBackgroundColor = '#DCDEE6';
      chipColor = '#494E65';
      chipLabel = 'Allocated';
      break;
    case 'In Progress':
      chipBackgroundColor = '#CDDEEE';
      chipColor = '#2A547E';
      chipLabel = 'In Progress';
      break;
    case 'Fixed':
      chipBackgroundColor = '#FFD68A';
      chipColor = '#754C00';
      chipLabel = 'Fixed';
      break;
    case 'Approved':
      chipBackgroundColor = '#ACE1AF';
      chipColor = '#205924';
      chipLabel = 'Approved';
      break;
    case 'Testing':
      chipBackgroundColor = '#AFAFED';
      chipColor = '#191970';
      chipLabel = 'Testing';
      break;
    case 'Rejected':
      chipBackgroundColor = '#F29C9E';
      chipColor = '#6D0E10';
      chipLabel = 'Rejected';
      break;
    case 'Clarified by User':
      chipBackgroundColor = '#FFFF94';
      chipColor = '#808000';
      chipLabel = 'Clarified by User';
      break;
    case 'Resolved':
      chipBackgroundColor = '#ADFF9E';
      chipColor = '#168900';
      chipLabel = 'Resolved';
      break;
    case 'Re-Open':
      chipBackgroundColor = '#F29C9E';
      chipColor = '#6D0E10';
      chipLabel = 'Re-Open';
      break;
    case 'Closed':
      chipBackgroundColor = '#FFCA4B';
      chipColor = '#372700';
      chipLabel = 'Closed';
      break;
    case 'Production Movement':
      chipBackgroundColor = '#FFED8A';
      chipColor = '#756300';
      chipLabel = 'Production Movement';
      break;
    case 'Clarification Required':
      chipBackgroundColor = '#96D3D3';
      chipColor = '#193D3C';
      chipLabel = 'Clarification Required';
      break;
    case 'UnAssigned':
      chipBackgroundColor = '#C5ABA8';
      chipColor = '#362624';
      chipLabel = 'UnAssigned';
      break;
      case 'Approval For Code Review':
      chipBackgroundColor = '#CEF3CE';
      chipColor = '#228B22';
      chipLabel = 'Approval For Code Review';
      break;
    default:
      chipBackgroundColor = '#D9E4EC';
      chipColor = '#385E72';
      chipLabel = 'Unknown';
  }

  return <Chip label={chipLabel} sx={{color: chipColor, backgroundColor: chipBackgroundColor, fontWeight: 'bold'}}/>;
};

export default StatusBadge;
