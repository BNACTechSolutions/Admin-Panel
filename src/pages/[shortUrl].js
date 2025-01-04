import { useEffect } from 'react';

const ShortUrlPage = ({ shortUrl }) => {
    useEffect(() => {
        const fetchRedirectUrl = async () => {
            try {               
                const response = await fetch(`https://ai-exhibit-display.onrender.com/api/redirect/${shortUrl}`);
                const data = await response.json();
                alert(data.redirectUrl)

                if (data.redirectUrl) {
                    // Redirect the user to the URL received from the backend
                    window.location.href = data.redirectUrl;
                } else {
                    console.error('No redirect URL found');
                }
            } catch (error) {
                console.error('Error fetching redirect URL:', error);
            }
        };

        // Fetch and redirect as soon as the component mounts
        fetchRedirectUrl();
    }, [shortUrl]);

    return <div>Redirecting...</div>;
};

export async function getServerSideProps(context) {
    // Extract the short URL from the URL parameters
    const { shortUrl } = context.params;

    return {
        props: {
            shortUrl, // Pass the short URL to the page
        },
    };
}

export default ShortUrlPage;
