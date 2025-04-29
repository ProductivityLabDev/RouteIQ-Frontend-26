import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

export function CreateAnnouncement() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        navigate('/dashboard/announcements');
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setImageName(e.target.files[0].name);
    };

    return (
        <section>
            <h1 className="block antialiased tracking-normal mt-7 text-[24px] md:text-[32px] font-bold leading-[1.3] text-inherit">
                Create Announcement
            </h1>
            <form onSubmit={handleSubmit} className='bg-white w-full h-[80vh] rounded-md mt-1 p-3 md:p-8'>
                <div className="md:w-[500px]">
                    <h6 className="block antialiased tracking-normal mb-4 text-[14px] font-bold leading-[1.3] text-inherit">
                        Title
                    </h6>
                    <input
                        required
                        placeholder="Enter Title"
                        className='bg-[#F5F6FA] border border-[#D5D5D5] p-3 w-full rounded-[6px] outline-none'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <h6 className="block mt-10 antialiased tracking-normal mb-4 text-[14px] font-bold leading-[1.3] text-inherit">
                        Image
                    </h6>
                    <div className='flex items-center bg-[#F5F6FA] border border-[#D5D5D5] pl-2 py-0.5 rounded-lg'>
                        <label className="flex justify-center w-[150px] md:w-[14rem] font-normal text-[14px] text-white items-center gap-3 bg-[#C01824] cursor-pointer p-2 rounded-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-7 w-7 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                />
                            </svg>
                            Upload Image
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                        {imageName && <span className="ml-4 text-gray-700">{imageName}</span>}
                    </div>
                    <h6 className="block mt-7 antialiased tracking-normal mb-4 text-[14px] font-bold leading-[1.3] text-inherit">
                        Description
                    </h6>
                    <div className="md:w-[500px]">
                        <textarea
                            rows={10}
                            required
                            placeholder="Description"
                            className="bg-[#F5F6FA] w-full outline-none rounded-[6px] p-2 border border-[#D5D5D5]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <Button type='submit' className="mt-6 bg-[#C01824] capitalize font-medium text-[18px] w-[180px] rounded-lg opacity-100 py-3">
                    Create
                </Button>
            </form>
        </section>
    );
}

export default CreateAnnouncement;
