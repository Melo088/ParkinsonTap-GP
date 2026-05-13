import { authService } from "./authService";

export const analysisService = {
    async fetchAnalysis(testId) {
        const res = await authService.fetchWithAuth(`/analysis/${testId}`);
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.message ?? `Error ${res.status}`);
        }
        return res.json();
    },
};
