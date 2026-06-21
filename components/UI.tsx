"use client";

import React, { ReactNode } from "react";

// ==========================================
// CARD COMPONENT
// ==========================================
interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: string;
  className?: string;
  onClick?: () => void;
  actions?: ReactNode;
}

export function Card({
  children,
  title,
  subtitle,
  icon,
  className = "",
  onClick,
  actions,
}: CardProps) {
  const isClickable = !!onClick;
  return (
    <div
      onClick={onClick}
      className={`bg-bg-secondary border border-border-color rounded-xl p-5 shadow-card transition-smooth ${
        isClickable ? "hover:border-accent-red/40 hover:translate-y-[-2px] cursor-pointer" : ""
      } ${className}`}
    >
      {(title || icon || actions) && (
        <div className="flex items-center justify-between mb-4 border-b border-border-color/50 pb-3">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red">
                <i className={`${icon} text-sm`}></i>
              </div>
            )}
            <div>
              {title && <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>}
              {subtitle && <p className="text-[10px] text-text-secondary mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

// ==========================================
// BADGE COMPONENT
// ==========================================
interface BadgeProps {
  status: "pending" | "approved" | "rejected" | "active" | "completed" | "info" | string;
  label?: string;
  className?: string;
}

export function Badge({ status, label, className = "" }: BadgeProps) {
  const normalized = status.toLowerCase();
  let colorClasses = "bg-bg-input text-text-secondary border-border-color";

  if (normalized === "approved" || normalized === "active" || normalized === "accepted" || normalized === "completed") {
    colorClasses = "bg-accent-green/10 text-accent-green border-accent-green/20";
  } else if (normalized === "pending" || normalized === "reviewed") {
    colorClasses = "bg-amber-500/10 text-amber-500 border-amber-500/20";
  } else if (normalized === "rejected" || normalized === "failed") {
    colorClasses = "bg-accent-red/10 text-accent-red border-accent-red/20";
  } else if (normalized === "info" || normalized === "scheduled") {
    colorClasses = "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border uppercase scale-90 origin-left ${colorClasses} ${className}`}
    >
      {label || status}
    </span>
  );
}

// ==========================================
// PAGE HEADER COMPONENT
// ==========================================
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8 pb-5 border-b border-border-color/60">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">{title}</h1>
        {description && <p className="text-xs text-text-secondary mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 self-start md:self-auto">{actions}</div>}
    </div>
  );
}

// ==========================================
// TABLE COMPONENT
// ==========================================
interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export function Table({ headers, children, className = "" }: TableProps) {
  return (
    <div className={`overflow-x-auto w-full border border-border-color rounded-xl bg-bg-secondary/40 shadow-card ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-color bg-bg-secondary/80">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-5 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider select-none"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color/40 text-xs font-medium text-text-primary">
          {children}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// MODAL COMPONENT
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div
        className={`bg-bg-secondary border border-border-color rounded-2xl w-full ${sizeClasses[size]} shadow-card relative z-10 glass-panel max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border-color/80 flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-bg-input border border-border-color hover:border-accent-red/40 flex items-center justify-center text-text-secondary hover:text-white transition-fast cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-text-secondary leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-border-color/80 bg-bg-input/20 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
