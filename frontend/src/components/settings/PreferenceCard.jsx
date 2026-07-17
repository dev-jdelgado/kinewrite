export default function PreferenceCard({
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <div className="border rounded-xl shadow-md p-4 mb-5 flex justify-between items-center">
            <div>
                <h3 className="font-bold text-xl">{title}</h3>
                <p className="text-gray-500 text-sm">{description}</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                />

                <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition"></div>

                <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition peer-checked:translate-x-6"></div>
            </label>
        </div>
    );
}