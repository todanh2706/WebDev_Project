const Button = ({
    children,
    isLoading = false,
    loadingText = 'Loading...',
    className = '',
    disabled = false,
    type = 'button',
    ...rest
}) => {
    return (
        <button
            type={type}
            className={`btn btn-auction d-flex justify-content-center align-items-center gap-2 ${className}`}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading ? (
                <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>{loadingText}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
