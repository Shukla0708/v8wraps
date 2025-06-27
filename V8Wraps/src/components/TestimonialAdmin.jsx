import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_APP_API_BASE_URL; //"http://localhost:5000/api/testimonials"; 

export default function TestimonialAdmin() {
    const [pendingTestimonials, setPendingTestimonials] = useState([]);
    const [approvedTestimonials, setApprovedTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}api/testimonials/gettestimonials`);
            const result = await response.json();

            if (response.ok) {
                setPendingTestimonials(result.pending);
                setApprovedTestimonials(result.approved);
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {

        await fetch(`${API_URL}api/testimonials/${id}/approve`, { method: 'PUT' });
        fetchTestimonials();
    };

    const handleUnapprove = async (id) => {
        try {
            await fetch(`${API_URL}api/testimonials/${id}/unapprove`, { method: 'PUT' });
        }
        catch (error) {
            console.error(error);
        }
        fetchTestimonials();
    };

    const handleReject = async (id) => {
        await fetch(`${API_URL}api/testimonials/${id}`, { method: 'DELETE' });
        fetchTestimonials();
    };

    const TestimonialCard = ({ testimonial, isPending }) => (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <div className="text-yellow-400 text-sm">
                        {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                    </div>
                </div>
                <span className="text-xs text-gray-500">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                </span>
            </div>
            <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
            <div className="flex gap-2">
                {isPending ? (
                    <>
                        <button onClick={() => handleApprove(testimonial.id)} className="bg-green-600 text-white px-4 py-2 rounded text-sm">Approve</button>
                        <button onClick={() => handleReject(testimonial.id)} className="bg-red-600 text-white px-4 py-2 rounded text-sm">Reject</button>
                    </>
                ) : (
                    <button onClick={() => handleUnapprove(testimonial.id)} className="bg-orange-600 text-white px-4 py-2 rounded text-sm">Unapprove</button>
                )}
            </div>
        </div>
    );

    if (loading) return <div className="text-center py-10">Loading testimonials...</div>;

    return (
        <section id="testimonials">

            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-8">Testimonial Management</h1>
                <div className="flex border-b mb-6">
                    <button onClick={() => setActiveTab('pending')} className={`px-6 py-3 ${activeTab === 'pending' ? 'border-b-2 text-orange-600' : 'text-gray-500'}`}>Pending ({pendingTestimonials.length})</button>
                    <button onClick={() => setActiveTab('approved')} className={`px-6 py-3 ${activeTab === 'approved' ? 'border-b-2 text-orange-600' : 'text-gray-500'}`}>Approved ({approvedTestimonials.length})</button>
                </div>

                {activeTab === 'pending' && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {pendingTestimonials.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No testimonials pending approval</p>
                        ) : (
                            pendingTestimonials.map(t => <TestimonialCard key={t.id} testimonial={t} isPending={true} />)
                        )}
                    </div>
                )}

                {activeTab === 'approved' && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {approvedTestimonials.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No approved testimonials</p>
                        ) : (
                            approvedTestimonials.map(t => <TestimonialCard key={t.id} testimonial={t} isPending={false} />)
                        )}
                    </div>
                )}
            </div>

        </section>
    );
}
