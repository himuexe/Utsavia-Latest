const AddressDisplay = ({ userProfile, onEdit }) => {
    if (!userProfile) return null;
  
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Delivery Address</h2>
          <button
            onClick={onEdit}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            Edit
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-zinc-400">Phone: {userProfile?.phone || 'Not provided'}</p>
          <p className="text-zinc-400">Address: {userProfile?.address || 'Not provided'}</p>
        </div>
      </div>
    );
  };
  export default AddressDisplay;