import { BRAND } from "@/lib/colors";
import { motion } from "framer-motion";

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
}

const Loader = ({ text = "Loading content...", fullScreen = false }: LoaderProps) => {
  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        width: '100%',
        minHeight: '200px',
      };

  return (
    <div style={containerStyle}>
      <motion.div
        style={{
          width: "48px",
          height: "48px",
          border: `4px solid ${BRAND.slate100}`,
          borderTopColor: BRAND.primary,
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginTop: "16px",
            color: BRAND.slate400,
            fontSize: "0.95rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
