<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';

interface Project {
    title: string;
    description: string;
    tags: string[];
    url: string | null;
    repo: string | null;
}

interface Profile {
    name: string;
    title: string;
    tagline: string;
    about: string;
    email: string;
    location: string;
    socials: { label: string; url: string }[];
    skills: string[];
    projects: Project[];
    experience: { role: string; company: string; period: string; summary: string }[];
}

defineProps<{ profile: Profile }>();
</script>

<template>
    <Head :title="`${profile.name} - ${profile.title}`" />

    <div class="min-h-screen bg-background text-foreground">
        <!-- Nav -->
        <header class="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
            <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                <a href="#top" class="font-semibold">{{ profile.name }}</a>
                <div class="flex items-center gap-6 text-sm text-muted-foreground">
                    <a href="#projects" class="hover:text-foreground">Projects</a>
                    <a href="#experience" class="hover:text-foreground">Experience</a>
                    <a href="#contact" class="hover:text-foreground">Contact</a>
                    <Link :href="$page.props.auth?.user ? '/dashboard' : '/login'" class="hover:text-foreground">
                        {{ $page.props.auth?.user ? 'Dashboard' : 'Login' }}
                    </Link>
                </div>
            </nav>
        </header>

        <main id="top" class="mx-auto max-w-5xl space-y-24 px-6 py-20">
            <!-- Hero -->
            <section class="space-y-6">
                <p class="text-sm font-medium text-muted-foreground">{{ profile.location }}</p>
                <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
                    Hi, I'm {{ profile.name }}.
                </h1>
                <p class="text-xl text-muted-foreground sm:text-2xl">
                    {{ profile.title }}. {{ profile.tagline }}
                </p>
                <div class="flex flex-wrap gap-3 pt-2">
                    <a
                        href="#projects"
                        class="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                        View my work
                    </a>
                    <a
                        href="#contact"
                        class="rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent"
                    >
                        Get in touch
                    </a>
                </div>
            </section>

            <!-- About + Skills -->
            <section class="grid gap-10 md:grid-cols-2">
                <div class="space-y-4">
                    <h2 class="text-2xl font-semibold">About</h2>
                    <p class="leading-relaxed text-muted-foreground">{{ profile.about }}</p>
                </div>
                <div class="space-y-4">
                    <h2 class="text-2xl font-semibold">Skills</h2>
                    <ul class="flex flex-wrap gap-2">
                        <li
                            v-for="skill in profile.skills"
                            :key="skill"
                            class="rounded-full border bg-card px-3 py-1 text-sm"
                        >
                            {{ skill }}
                        </li>
                    </ul>
                </div>
            </section>

            <!-- Projects -->
            <section id="projects" class="space-y-8">
                <h2 class="text-2xl font-semibold">Projects</h2>
                <div class="grid gap-6 sm:grid-cols-2">
                    <article
                        v-for="project in profile.projects"
                        :key="project.title"
                        class="flex flex-col rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md"
                    >
                        <h3 class="text-lg font-semibold">{{ project.title }}</h3>
                        <p class="mt-2 flex-1 text-sm text-muted-foreground">{{ project.description }}</p>
                        <ul class="mt-4 flex flex-wrap gap-2">
                            <li
                                v-for="tag in project.tags"
                                :key="tag"
                                class="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                                {{ tag }}
                            </li>
                        </ul>
                        <div class="mt-5 flex gap-4 text-sm font-medium">
                            <a v-if="project.url" :href="project.url" target="_blank" rel="noopener" class="hover:underline">
                                Live site ↗
                            </a>
                            <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener" class="hover:underline">
                                Source ↗
                            </a>
                        </div>
                    </article>
                </div>
            </section>

            <!-- Experience -->
            <section id="experience" class="space-y-8">
                <h2 class="text-2xl font-semibold">Experience</h2>
                <ol class="space-y-8 border-l pl-6">
                    <li v-for="job in profile.experience" :key="job.role + job.company" class="relative">
                        <span class="absolute -left-[31px] top-1.5 size-2.5 rounded-full bg-primary"></span>
                        <p class="text-sm text-muted-foreground">{{ job.period }}</p>
                        <h3 class="font-semibold">{{ job.role }} · {{ job.company }}</h3>
                        <p class="mt-1 text-sm text-muted-foreground">{{ job.summary }}</p>
                    </li>
                </ol>
            </section>

            <!-- Contact -->
            <section id="contact" class="space-y-4 rounded-xl border bg-card p-8 text-center">
                <h2 class="text-2xl font-semibold">Let's work together</h2>
                <p class="text-muted-foreground">Have a project in mind or want to say hi? My inbox is open.</p>
                <a
                    :href="`mailto:${profile.email}`"
                    class="inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                    {{ profile.email }}
                </a>
                <ul class="flex justify-center gap-6 pt-2 text-sm text-muted-foreground">
                    <li v-for="s in profile.socials" :key="s.label">
                        <a :href="s.url" target="_blank" rel="noopener" class="hover:text-foreground">{{ s.label }}</a>
                    </li>
                </ul>
            </section>
        </main>

        <footer class="border-t py-8 text-center text-sm text-muted-foreground">
            © {{ new Date().getFullYear() }} {{ profile.name }}
        </footer>
    </div>
</template>