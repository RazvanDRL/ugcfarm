type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="container max-w-5xl mx-auto px-6">{children}</div>;
};

export default Container;
