const app = new Vue({
    el: "#app",
    data: {
        url: "",
        slug: "",
        submitMessage: "",
    },
    methods: {
        async onSubmit() {
            const response = await fetch("/api/url", {
                method: "POST",
                headers: [["Content-Type", "application/json"]],
                body: JSON.stringify({
                    url: this.url,
                    slug: this.slug,
                }),
            });

            const json = await response.json();
            this.submitMessage = json.message;
        },
    },
});
