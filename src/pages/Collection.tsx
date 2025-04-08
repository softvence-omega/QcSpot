import CollectionCard from "../components/CollectionCard";
import Loader from "../components/Loader";
import useCollection from "../hooks/useCollection";

export interface CollectionProps {
  _id: string;
  storeName: string;
  productCode: string;
}

const Collection = () => {
  const { collectionData, collectionLoading, collectionRefetch } =
    useCollection();
  if (collectionLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto pt-40 md:pt-24 pb-10 px-4">
      <h2 className="relative text-center w-fit mx-auto duration-300 text-2xl font-bold my-6">
        My Collection
      </h2>

      <div>
        {collectionData?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {collectionData.map((collection: CollectionProps) => (
              <CollectionCard
                collection={collection}
                refetch={collectionRefetch}
                key={collection._id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No collections found.</div>
        )}
      </div>
    </div>
  );
};

export default Collection;
