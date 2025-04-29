import { Button, Card, Typography } from "@material-tailwind/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export function Profile() {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <section>
        <Card className="lg:p-9 p-3 mt-7 rounded-[6px]" color="white" shadow={true}>
          <div className="text-center">
            <div className="h-[118px] w-[118px] flex justify-center items-center overflow-hidden mx-auto rounded-full bg-[#ECECEE] relative">
              {image ? (
                <img src={image} alt="Uploaded" className="object-cover h-full w-full" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                  <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                  <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
              )}
              <input
                type="file"
                required
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </div>
            <p className="pt-2 text-[14px] font-semibold text-[#C01824]">Upload photo</p>
          </div>
          <form className="mt-8 w-full max-w-[800px] mb-2 mx-auto">
            <div className='flex justify-between md:flex-row flex-col lg:space-x-7 md:space-x-2'>
              <div className="mb-1 flex flex-col gap-6 w-full md:pb-0 pb-2">
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  School Name
                </Typography>
                <input
                  type='text'
                  required
                  placeholder="Enter your school name"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  Office Phone No
                </Typography>
                <input
                  type='tel'
                  required
                  placeholder="Enter your phone number"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  Address
                </Typography>
                <input
                  type="text"
                  required
                  placeholder="Enter your address"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  State
                </Typography>
                <input
                  type="text"
                  required
                  placeholder="Enter your state"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
              </div>
              <div className="mb-1 flex flex-col gap-6 w-full">
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  Email
                </Typography>
                <input
                  type='email'
                  required
                  placeholder="Enter your email address"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  Mobile No
                </Typography>
                <input
                  type='tel'
                  required
                  placeholder="Enter your mobile number"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  ZIP Code
                </Typography>
                <input
                  type="number"
                  required
                  placeholder="Enter your ZIP code here"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  City
                </Typography>
                <input
                  type="text"
                  required
                  placeholder="Enter your city"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
              </div>
            </div>
            <Link to={`/dashboard/settings`}>
              <Button className="lg:mt-12 lg:mb-8 mb-5 mt-8 px-20 md:px-32 text-[18px] font-normal capitalize mx-auto flex bg-[#C01824]" variant='filled' size='lg'>
                Save
              </Button>
            </Link>
          </form>
        </Card>
      </section>
    </>
  );
}

export default Profile;
