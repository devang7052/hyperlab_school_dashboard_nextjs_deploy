'use client';

import React from 'react';
import { PaymentStatus } from '../../models/schoolStudent';

interface PaymentStatusConfirmDialogProps {
  isOpen: boolean;
  studentName: string;
  currentStatus: PaymentStatus;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PaymentStatusConfirmDialog: React.FC<PaymentStatusConfirmDialogProps> = ({
  isOpen,
  studentName,
  currentStatus,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const newStatus = currentStatus === PaymentStatus.PAID ? PaymentStatus.UNPAID : PaymentStatus.PAID;
  const actionText = newStatus === PaymentStatus.PAID ? 'Mark as Paid?' : 'Mark as Unpaid?';

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
      <div className="bg-[var(--background)] rounded-lg shadow-xl max-w-sm w-full mx-4">
        {/* Header */}
        <div className="bg-[var(--neutral-500)] text-[var(--background)] text-center py-3 rounded-t-lg">
          <h3 className="text-lg font-medium font-['Manrope']">{actionText}</h3>
        </div>
        
        {/* Content */}
        <div className="py-4 px-14 text-center">
          <p className="text-[var(--neutral-500)] text-xl font-bold mb-6 font-['Manrope']">{studentName}</p>
          
          {/* Buttons */}
          <div className="flex  justify-between">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-7 py-3 border-2  border-blue-400 text-blue-400 rounded hover:bg-blue-50 transition-colors cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-7 py-3 bg-[var(--primary-600)] text-[var(--background)] rounded hover:bg-[var(--primary-500)] cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Yes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusConfirmDialog; 