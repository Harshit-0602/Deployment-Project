import { useState, useEffect } from "react";
import axios from "axios";

const usePolling = (endpoints, interval = 5000) => {
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isActive = true; // To prevent updates after unmount

        const fetchData = async () => {
            try {
                const responses = await Promise.all(
                    endpoints.map((endpoint) => axios.get(endpoint))
                );
                if (isActive) {
                    const results = responses.reduce((acc, response, idx) => {
                        acc[endpoints[idx]] = response.data;
                        return acc;
                    }, {});
                    setData(results);
                }
            } catch (error) {
                if (isActive) {
                    setErrors((prev) => ({
                        ...prev,
                        [error.config?.url]: error.message,
                    }));
                }
            } finally {
                if (isActive) setLoading(false);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, interval);

        return () => {
            isActive = false;
            clearInterval(intervalId);
        };
    }, [endpoints, interval]);

    return { data, errors, loading };
};

export default usePolling;
