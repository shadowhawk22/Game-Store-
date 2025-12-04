import React from 'react';

type IconProps = {
  className?: string;
};

export const ReceiptIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
        <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.914 9H3.086Zm6.134 4.5a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H10a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 0 1-.749.658h-7.5a.75.75 0 0 1-.75-.658L5.85 6.653l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.347-9Zm5.48.058a.75.75 0 1 0-1.499-.058l-.347 9a.75.75 0 0 0 1.5.058l.347-9Z" clipRule="evenodd" />
    </svg>
);

export const XIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

export const PrintIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.432.076-.85.22-1.23.425a.75.75 0 0 0-.5.886l.02.121c.218.796.897 1.442 1.719 1.671V21.375c0 1.036.84 1.875 1.875 1.875h10.25a1.875 1.875 0 0 0 1.875-1.875V10.842a3.375 3.375 0 0 0 1.719-1.671l.02-.121a.75.75 0 0 0-.5-.886 3.375 3.375 0 0 0-1.23-.425V3.375c0-1.036-.84-1.875-1.875-1.875H7.875ZM7.5 9.188a1.875 1.875 0 0 0 0-3.75V3.375c0-.207.168-.375.375-.375h8.25c.207 0 .375.168.375.375v2.063a1.875 1.875 0 0 0 0 3.75H7.5Z" clipRule="evenodd" />
        <path d="M11.25 12.75a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" />
    </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
    </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
    </svg>
);

export const UserGroupIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63l-2.693 1.5c-.217.122-.474.122-.692 0l-2.693-1.5a.75.75 0 0 1-.363-.63V19.125ZM17.25 19.125a7.125 7.125 0 0 1 5.25 0v.003l-.001.119a.75.75 0 0 1-.363.63l-2.693 1.5c-.217.122-.474.122-.692 0l-2.693-1.5a.75.75 0 0 1-.363-.63V19.125Z" />
    </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.7-4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
  </svg>
);

export const ClipboardListIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.75 3.03v.75a2.25 2.25 0 0 0 4.5 0v-.75A.75.75 0 0 1 18 2.28a.75.75 0 0 1 .75.75v.75a3.75 3.75 0 0 1-7.5 0v-.75a.75.75 0 0 1 .75-.75.75.75 0 0 1 .75.75Z" />
        <path fillRule="evenodd" d="M3 8.25a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Zm15 1.5a.75.75 0 0 0-.75-.75H6a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 .75.75h12a.75.75 0 0 0 .75-.75v-9ZM9 12.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
);

export const UserPlusIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM-1.5 15a3 3 0 0 1 3-3h1.5a3 3 0 0 1 3 3v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v.75a.75.75 0 0 1-1.5 0v-.75Z" transform="translate(4.5 4.5)" />
        <path d="M11.25 8.25a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5a.75.75 0 0 0-1.5 0v1.5h-1.5Z" transform="translate(4.5 4.5)" />
    </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    </svg>
);

export const BellIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25A.75.75 0 0 1 12.75 3v.342a11.206 11.206 0 0 1 5.247 2.115.75.75 0 0 1-.521 1.362A9.706 9.706 0 0 0 12.75 6V3.75A.75.75 0 0 1 12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9 9h-1.5a.75.75 0 0 1 0-1.5H21c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2.25ZM10.5 9a.75.75 0 0 1 .75.75v3.19l2.22-1.283a.75.75 0 1 1 .75 1.3l-2.5 1.443a.75.75 0 0 1-.75 0l-2.5-1.443a.75.75 0 1 1 .75-1.3l2.22 1.283V9.75a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const CubeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.542l-.123.736-2.094 12.564a1.875 1.875 0 0 0 1.85 2.158h4.772a1.875 1.875 0 0 0 1.85-2.158l-2.094-12.564-.123.736A1.875 1.875 0 0 0 12.172 2.25h-.344Zm-.623 1.724a.375.375 0 0 1 .37-.308h.344a.375.375 0 0 1 .37.308l2.054 12.324a.375.375 0 0 1-.37.43h-4.772a.375.375 0 0 1-.37-.43L11.205 3.974Z" clipRule="evenodd" />
  </svg>
);

export const CalendarDaysIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
  </svg>
);

export const TruckIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15v-1.5H1.5V15a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V15h3.75v.75a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V15h2.25Z" />
    <path d="M15 9.75a3 3 0 0 0 3-3V4.5a3 3 0 0 0-3-3h-1.5a.75.75 0 0 0-.75.75V3a.75.75 0 0 0 .75.75H15v1.5a1.5 1.5 0 0 1-1.5 1.5H12a.75.75 0 0 0-.75.75V9a.75.75 0 0 0 .75.75h3Z" />
    <path fillRule="evenodd" d="M10.5 19.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm.75-1.5a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM18 19.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm.75-1.5a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z" clipRule="evenodd" />
    <path d="M15 13.5a.75.75 0 0 0 .75.75h3.75a.75.75 0 0 0 .75-.75V6.375c0-1.035-.84-1.875-1.875-1.875H15V13.5Z" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06L10.5 12.94 8.78 11.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.5-4.5Z" clipRule="evenodd" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);


export const Cog6ToothIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.542L9.046 5.5l-1.328.81a1.5 1.5 0 0 0-.724 2.118l.844 1.46a1.5 1.5 0 0 0 2.118.724l1.328-.81 1.766 1.766-.81 1.328a1.5 1.5 0 0 0 .724 2.118l1.46.844a1.5 1.5 0 0 0 2.118-.724l.81-1.328 1.766 1.766-1.328.81a1.5 1.5 0 0 0-.724 2.118l.844 1.46a1.5 1.5 0 0 0 2.118.724l1.328-.81 1.182 1.706a1.875 1.875 0 0 0 3.41-1.125l.844-1.46a1.5 1.5 0 0 0-.724-2.118l-1.328-.81 1.766-1.766.81 1.328a1.5 1.5 0 0 0 2.118.724l1.46-.844a1.5 1.5 0 0 0 .724-2.118l-.844-1.46a1.5 1.5 0 0 0-2.118-.724l-1.328.81-1.766-1.766 1.328-.81a1.5 1.5 0 0 0 .724-2.118l-.844-1.46a1.5 1.5 0 0 0-2.118-.724l-1.328.81-1.182-1.706A1.875 1.875 0 0 0 11.078 2.25ZM10.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
    </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
    </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
    </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
    </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
    </svg>
);

export const ArrowDownTrayIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

export const ArrowUpTrayIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 16.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V17.25a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V17.25a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

export const ArchiveBoxIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
    <path fillRule="evenodd" d="M1.5 9.75a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v8.25a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.75Zm19.5 0a1.5 1.5 0 0 0-1.5-1.5h-15a1.5 1.5 0 0 0-1.5 1.5v8.25a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5V9.75ZM9 12.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H9Z" clipRule="evenodd" />
  </svg>
);

export const PhotoIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
    </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006Z" clipRule="evenodd" />
  </svg>
);

export const GiftIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v.756a49.106 49.106 0 0 1 3.235-.249c.975 0 1.338.299 1.481.442.145.145.444.508.444 1.482v.375c0 .213-.006.423-.018.63l.007.004a2.725 2.725 0 0 1 1.096.099c.497.225.756.79.756 1.207v2.25c0 .217-.21.429-.53.581-.14.067-.312.125-.53.179a22.99 22.99 0 0 1-2.313.404c-.67.08-1.412.128-2.172.128h-.077c-.76 0-1.502-.048-2.172-.128a22.99 22.99 0 0 1-2.313-.404c-.218-.054-.39-.112-.53-.179-.32-.152-.53-.364-.53-.581v-2.25c0-.418.259-.982.756-1.207.197-.09.43-.154.68-.192l.008-.001a6.76 6.76 0 0 1-.018-.63v-.375c0-.974.3-1.338.444-1.482.143-.144.506-.442 1.481-.442.969 0 2.04.084 3.235.249V3a.75.75 0 0 1 .75-.75Zm-3.75 4.5v.375c0 .203.05.405.142.585.091.18.22.335.38.453a.75.75 0 0 0 .428.137h.75a.75.75 0 0 0 .428-.137c.16-.118.289-.273.38-.453a1.125 1.125 0 0 0 .142-.585V6.75h-2.65Zm5.25 0v.375c0 .203.05.405.142.585.091.18.22.335.38.453a.75.75 0 0 0 .428.137h.75a.75.75 0 0 0 .428-.137c.16-.118.289-.273.38-.453a1.125 1.125 0 0 0 .142-.585V6.75h-2.65Zm-6.75.507v1.126c0 .145.042.26.118.344.076.084.19.143.324.186.253.081.657.164 1.188.234.529.07 1.136.113 1.77.113h.077c.634 0 1.241-.043 1.77-.113.53-.07.935-.153 1.188-.234.134-.043.248-.102.324-.186.076-.084.118-.199.118-.344V7.257a2.632 2.632 0 0 1-1.727-.466 2.63 2.63 0 0 1-1.023-1.213v-.005a3.78 3.78 0 0 0-.003.002 1.958 1.958 0 0 0-1.938 0 3.78 3.78 0 0 0-.003-.002v.005a2.63 2.63 0 0 1-1.023 1.213 2.632 2.632 0 0 1-1.727.466Z" clipRule="evenodd" />
    <path d="M5.5 12.75c0 .414.336.75.75.75h11.5a.75.75 0 0 0 .75-.75V20.5a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5V12.75ZM12 13.5v7.5h1.5v-7.5H12Z" />
  </svg>
);

export const CloudArrowUpIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 16.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V17.25a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V17.25a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const EnvelopeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
  </svg>
);

export const ComputerDesktopIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-2.45l.344 1.966c.091.522-.296.991-.822.991H7.678c-.527 0-.914-.469-.822-.991L7.2 18H4.75a3 3 0 0 1-3-3V5.25Zm3-1.5a1.5 1.5 0 0 0-1.5 1.5v9.75a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H5.25Z" clipRule="evenodd" />
  </svg>
);

export const ArrowTopRightOnSquareIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.25a.75.75 0 1 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z" clipRule="evenodd" />
  </svg>
);