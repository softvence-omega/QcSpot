import Loader from "../components/Loader";
import useCollection from "../hooks/useCollection";

const Collection = () => {
  const { collectionData, collectionLoading } = useCollection();
  if (collectionLoading) return <Loader />;
  console.log("collectionData", collectionData);

  return (
    <div className="max-w-7xl mx-auto pt-40 md:pt-24 pb-10 px-4">
      <h2 className="relative text-center w-fit mx-auto duration-300 text-2xl font-bold my-6">
        My Collection
      </h2>

      <div></div>
    </div>
  );
};

export default Collection;
