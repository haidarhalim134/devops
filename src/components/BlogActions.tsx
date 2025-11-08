"use client";

import { useEffect, useState } from "react";
import { AddBlogButton } from "./AddBlogButton";

export function BlogActions() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        fetch("/api/auth/verify")
            .then((res) => res.json())
            .then((data) => {
                setIsLoggedIn(!!data.user);
            })
            .catch(() => {
                setIsLoggedIn(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Don't show button while checking auth status or if not logged in
    if (loading || !isLoggedIn) {
        return null;
    }

    return <AddBlogButton />;
}
