import { useState, useEffect } from "react";

const categories = ["Wraps", "PPF", "Tints", "Custom Graphics"];
const category_type = ["Before", "After", "Single", "Hero"];

export default function AdminPanel() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingImage, setEditingImage] = useState(null);
    const backend = import.meta.env.VITE_APP_API_BASE_URL;

    const apiFetch = async (url, options = {}) => {
        const token = localStorage.getItem("token");
        const headers = {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            alert("Session expired. Login again")
            window.location.reload(); // or redirect to login
        }

        return response;
    };

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        category: "Wraps",
        description: "",
        is_featured: false,
        display_order: 0
    });

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        try {
            setLoading(true);
            const response = await apiFetch(`${backend}api/images`, {});
            //   const data = await imageService.getImages();
            const data = await response.json();
            setImages(data);
        } catch (err) {
            setError("Failed to load images");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError("Please select an image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError("Image size should be less than 10MB");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            // Upload to Cloudinary
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', file);
            cloudinaryFormData.append('upload_preset', import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
            cloudinaryFormData.append('folder', 'gallery'); // Optional: organize in folders

            const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: cloudinaryFormData,
                }
            );

            if (!cloudinaryResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const cloudinaryData = await cloudinaryResponse.json();
            const imageData = {
                cloudinary_public_id: cloudinaryData.public_id,
                cloudinary_url: cloudinaryData.secure_url,
                title: formData.title || null,
                category: formData.category,
                description: formData.description || null,
                is_featured: formData.is_featured,
                display_order: formData.display_order || 0,
            };

            const response = await apiFetch(`${backend}api/images`, {
                method: 'POST',
                body: JSON.stringify(imageData)
            });

            const savedImage = await response.json();

            //   const savedImage = await imageService.addImage(imageData);

            setImages([savedImage, ...images]);
            setSuccess("Image uploaded successfully!");

            // Reset form
            setFormData({
                title: "",
                category: "Wraps",
                description: "",
                is_featured: false,
                display_order: 0
            });

            // Reset file input
            e.target.value = '';

        } catch (err) {
            console.error('Upload error:', err);
            setError("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (image) => {
        setEditingImage(image);
        setFormData({
            title: image.title || "",
            category: image.category,
            description: image.description || "",
            is_featured: image.is_featured,
            display_order: image.display_order || 0
        });
    };

    const handleUpdate = async () => {
        if (!editingImage) return;

        setLoading(true);
        try {
            const response = await apiFetch(`${backend}api/images/${editingImage.id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            const updatedImage = await response.json();
            //   const updatedImage = await imageService.updateImage(editingImage.id, formData);
            setImages(images.map(img => img.id === editingImage.id ? updatedImage : img));
            setEditingImage(null);
            setSuccess("Image updated successfully!");
        } catch (err) {
            setError("Failed to update image");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, publicId) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        setLoading(true);
        try {
            await apiFetch(`${backend}api/images/${id}`, {
                method: 'DELETE',
            });

            //   await imageService.deleteImage(id);
            setImages(images.filter(img => img.id !== id));
            setSuccess("Image deleted successfully!");
            try {
                const response = await apiFetch(`${backend}api/images/delete-cloudinary-image`, {
                    method: 'POST',
                    body: JSON.stringify({ publicId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to delete from Cloudinary');
                }

                const result = await response.json();
                return result;
            } catch (error) {
                console.error('Error deleting from Cloudinary:', error);
                throw error;
            }

        } catch (err) {
            setError("Failed to delete image");
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Gallery Admin Panel
                </h1>

                {/* Messages */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-center">
                        <span className="text-red-600">{error}</span>
                        <button onClick={clearMessages} className="text-red-400 hover:text-red-600">×</button>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                        <span className="text-green-600">{success}</span>
                        <button onClick={clearMessages} className="text-green-400 hover:text-green-600">×</button>
                    </div>
                )}

                {/* Upload Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingImage ? 'Edit Image' : 'Upload New Image'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Enter image title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comparison_type *
                        </label>
                        <select
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            {category_type.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="mr-2"
                            />
                            <label className="text-sm font-medium text-gray-700">
                                Featured Image
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={formData.display_order}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                min="0"
                            />
                        </div>
                    </div>

                    {!editingImage && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Image *
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Supported formats: JPG, PNG, GIF. Max size: 10MB
                            </p>
                        </div>
                    )}

                    {editingImage && (
                        <div className="flex space-x-4">
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Updating..." : "Update Image"}
                            </button>
                            <button
                                onClick={() => setEditingImage(null)}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {uploading && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Uploading image...</p>
                        </div>
                    )}
                </div>

                {/* Images List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Manage Images ({images.length})
                    </h2>

                    {loading && !uploading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading images...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {images.map((image) => (
                                <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={image.cloudinary_url}
                                            alt={image.title || image.category}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-sm">
                                                    {image.title || 'Untitled'}
                                                </h3>
                                                <p className="text-xs text-gray-500">{image.category}</p>
                                            </div>
                                            {image.is_featured && (
                                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        {image.description && (
                                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                                {image.description}
                                            </p>
                                        )}

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(image)}
                                                className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(image.id, image.cloudinary_public_id)}
                                                className="flex-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}