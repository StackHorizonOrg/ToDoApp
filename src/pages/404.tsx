import { useRouter } from "next/router";
import { useEffect } from "react";

const NotFound = () => {
    const router = useRouter();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", router.pathname);
    }, [router.pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="text-center space-y-6 animate-fade-in">
                <div className="space-y-2">
                    <h1 className="text-9xl font-bold text-primary animate-scale-in">404</h1>
                    <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Sorry, the page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="pt-4">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 19-7-7 7-7"/>
                            <path d="M19 12H5"/>
                        </svg>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NotFound;