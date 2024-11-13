export function Button({ onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className='z-10 h-20 w-20 rounded-full bg-gray-500 text-white'
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  onClick,
  children,
  type = 'text',
  ...props
}: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      className='mb-4 w-full rounded-md bg-gray-400 p-3 text-white'
      style={{ backgroundColor: '#7FD6E1' }}
      {...props}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ onClick, children, type = 'text' }: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      className='rounded-md bg-gray-400 p-3 text-gray-50'
      style={{
        color: '#7FD6E1',
        border: '0.1rem solid #7FD6E1',
        backgroundColor: '#7FD6E11A',
        borderRadius: '100px',
        width: 'auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      }}
    >
      {children}
    </button>
  );
}

export function OutlineWhiteButton({ onClick, children, type = 'text' }: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      className='rounded-md bg-gray-400 p-3 text-gray-50'
      style={{
        color: '#000000',
        border: '0.1rem solid #C1C1C1',
        backgroundColor: '#ffffff',
        borderRadius: '100px',
        width: 'auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      }}
    >
      {children}
    </button>
  );
}

export function CircleButton({ onClick, children, color = '#000000' }: any) {
  return (
    <button
      onClick={onClick}
      className='z-10 h-20 w-20 rounded-full bg-gray-500 text-white'
      style={{
        backgroundColor: color,
        fontSize: '1.25rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </button>
  );
}
