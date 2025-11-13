import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/SchoolLayout';
import VendorDashboardHeader from '@/components/VendorDashboardHeader';
import { Typography, Button } from '@mui/material';
import colors from '@/utlis/Colors';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <MainLayout>
      <section className='w-full h-full'>
        <VendorDashboardHeader title='Access Denied' />
        <div className='flex flex-col items-center justify-center h-[60vh] gap-6'>
          <div className='text-center'>
            <div className='mb-6'>
              <svg
                className='mx-auto h-24 w-24 text-red-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            
            <Typography 
              fontSize={36} 
              fontWeight={800} 
              className="font-Nunito Sans text-[#C01824] mb-4"
            >
              🚫 Access Denied
            </Typography>
            
            <Typography 
              fontSize={20} 
              fontWeight={400} 
              className="font-Nunito Sans text-[#1F1F1F] mb-2"
            >
              You don't have permission to view this page.
            </Typography>
            
            <Typography 
              fontSize={16} 
              fontWeight={400} 
              className="font-Nunito Sans text-[#666666] mb-8"
            >
              Contact your administrator if you think this is a mistake.
            </Typography>
          </div>

          <div className='flex gap-4 flex-col sm:flex-row'>
            <Button
              variant='contained'
              onClick={handleGoBack}
              sx={{
                backgroundColor: colors.lightGrey,
                color: '#fff',
                textTransform: 'none',
                padding: '10px 30px',
                fontSize: '16px',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#7a7a7a',
                },
              }}
            >
              Go Back
            </Button>
            
            <Button
              variant='contained'
              onClick={handleGoToDashboard}
              sx={{
                backgroundColor: colors.redColor,
                color: '#fff',
                textTransform: 'none',
                padding: '10px 30px',
                fontSize: '16px',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#a0141e',
                },
              }}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Unauthorized;

