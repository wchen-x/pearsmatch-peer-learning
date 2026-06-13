type PageContainerProps = {
  children: React.ReactNode;
};

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {children}
    </main>
  );
}