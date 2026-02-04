import Header from "@/components/Header";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Header title={title} />
      <div className="flex-1 overflow-auto bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 mb-6">
            {description ||
              "This page is coming soon. Keep exploring the dashboard or contact support for more information."}
          </p>
        </div>
      </div>
    </div>
  );
}
