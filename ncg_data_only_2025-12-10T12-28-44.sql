--
-- PostgreSQL database dump
--

\restrict 7TzhM4PoUtPmRGUiwcy1lcNrNatEqZjgAghe0BdkveyxKVvqj0xExOAbHauQ7I2

-- Dumped from database version 15.15 (Homebrew)
-- Dumped by pg_dump version 15.15 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: about_core_values_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_core_values_section (id, title, subtitle, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media (id, alt, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y) FROM stdin;
\.


--
-- Data for Name: about_core_values_section_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_core_values_section_values (_order, _parent_id, id, icon_id, title, description) FROM stdin;
\.


--
-- Data for Name: about_cta_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_cta_section (id, title, description, button_text, button_link, background_image_id, overlay_opacity, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: about_hero; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_hero (id, quote, highlight_words, attribution, background_video_id, overlay_opacity, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: about_mission_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_mission_section (id, title, description, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: about_stats_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_stats_section (id, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: about_stats_section_stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_stats_section_stats (_order, _parent_id, id, value, label) FROM stdin;
\.


--
-- Data for Name: about_team_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_team_section (id, title, description, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: about_team_section_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_team_section_members (_order, _parent_id, id, image_id, name, role, bio) FROM stdin;
\.


--
-- Data for Name: about_us_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_us_section (id, section_label, heading, image_id, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: about_us_section_paragraphs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_us_section_paragraphs (_order, _parent_id, id, text) FROM stdin;
\.


--
-- Data for Name: approach_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.approach_section (id, title, heading, description, button_text, button_link, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: approach_section_steps; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.approach_section_steps (_order, _parent_id, id, title, description, image_id) FROM stdin;
\.


--
-- Data for Name: blogs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs (id, title, slug, date, description, image_id, link, hero_background_image_id, read_time, enable_social_sharing, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: blogs_content_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_content_sections (_order, _parent_id, id, section_type, section_title, intro_paragraph, quote_text, section_image_id) FROM stdin;
\.


--
-- Data for Name: blogs_content_sections_bullet_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_content_sections_bullet_items (_order, _parent_id, id, highlight_text, description) FROM stdin;
\.


--
-- Data for Name: blogs_content_sections_numbered_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_content_sections_numbered_items (_order, _parent_id, id, highlight_text, description) FROM stdin;
\.


--
-- Data for Name: blogs_content_sections_paragraphs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_content_sections_paragraphs (_order, _parent_id, id, text) FROM stdin;
\.


--
-- Data for Name: blogs_page_hero; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_page_hero (id, heading, background_image_id, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: career_find_place; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_find_place (id, image_id, tagline, title, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: career_find_place_paragraphs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_find_place_paragraphs (_order, _parent_id, id, text) FROM stdin;
\.


--
-- Data for Name: career_hero; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_hero (id, background_image_id, title, subtitle, description, button_text, button_link, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: career_job_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_job_section (id, heading, button_text, button_link, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: job_openings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_openings (id, title, slug, location, type, apply_by_date, description, hero_image_id, image_id, role_description, company_introduction, how_to_apply, department, remote_status, link, featured, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: career_job_section_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_job_section_rels (id, "order", parent_id, path, job_openings_id) FROM stdin;
\.


--
-- Data for Name: career_life_at_ncg; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_life_at_ncg (id, title, subtitle, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: career_life_at_ncg_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_life_at_ncg_images (_order, _parent_id, id, image_id) FROM stdin;
\.


--
-- Data for Name: career_spotify; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_spotify (id, icon_id, title, description, button_text, spotify_link, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: career_stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_stats (id, title, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: career_stats_stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_stats_stats (_order, _parent_id, id, value, label) FROM stdin;
\.


--
-- Data for Name: career_testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_testimonials (id, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: career_testimonials_testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_testimonials_testimonials (_order, _parent_id, id, image_id, name, role, quote) FROM stdin;
\.


--
-- Data for Name: career_work_here; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_work_here (id, title, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: career_work_here_cards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_work_here_cards (_order, _parent_id, id, number, description, image_id) FROM stdin;
\.


--
-- Data for Name: icons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.icons (id, name, svg_id, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: case_studies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies (id, title, slug, image_id, category, icon_type, icon_id, description, link, hero_background_image_id, hero_logo_id, intro_description, client_overview_client_name, client_overview_industry, client_overview_location, client_overview_size, challenges_title, challenges_description, how_n_c_g_helped_title, how_n_c_g_helped_subtitle, solutions_implemented_title, solutions_implemented_description, solutions_implemented_icon_image_id, value_delivered_title, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: case_studies_challenges_challenge_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies_challenges_challenge_items (_order, _parent_id, id, challenge) FROM stdin;
\.


--
-- Data for Name: case_studies_grid; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies_grid (id, button_text, button_link, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: case_studies_grid_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies_grid_rels (id, "order", parent_id, path, case_studies_id) FROM stdin;
\.


--
-- Data for Name: case_studies_hero; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies_hero (id, overline, heading, background_image_id, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: case_studies_how_n_c_g_helped_solutions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies_how_n_c_g_helped_solutions (_order, _parent_id, id, image_id, title, description) FROM stdin;
\.


--
-- Data for Name: case_studies_page; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies_page (id, hero_overline, hero_heading, hero_background_image_id, hero_intro_text, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: case_studies_page_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies_page_rels (id, "order", parent_id, path, case_studies_id) FROM stdin;
\.


--
-- Data for Name: case_studies_solution_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies_solution_tags (_order, _parent_id, id, tag) FROM stdin;
\.


--
-- Data for Name: case_studies_solutions_implemented_solution_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies_solutions_implemented_solution_items (_order, _parent_id, id, solution) FROM stdin;
\.


--
-- Data for Name: case_studies_value_delivered_value_cards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_studies_value_delivered_value_cards (_order, _parent_id, id, number, image_id, title, description) FROM stdin;
\.


--
-- Data for Name: contact_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_section (id, heading, team_member_name, team_member_position, team_member_image_id, team_member_linkedin_url, submit_button_text, privacy_text, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: contact_section_team_member_certifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_section_team_member_certifications (_order, _parent_id, id, name) FROM stdin;
\.


--
-- Data for Name: footer_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.footer_section (id, contact_us_phone_heading, contact_us_phone_sweden, contact_us_phone_denmark, contact_us_email_heading, contact_us_email, follow_us_title, bottom_bar_copyright_text, bottom_bar_privacy_label, bottom_bar_privacy_href, sweden_title, sweden_office_heading, sweden_address_line1, sweden_address_line2, malmo_title, malmo_office_heading, malmo_address_line1, malmo_address_line2, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: hero_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hero_section (id, main_heading, background_image_id, call_to_action_description, call_to_action_cta_heading, call_to_action_cta_link, call_to_action_background_color, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: hero_section_animated_texts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hero_section_animated_texts (_order, _parent_id, id, text) FROM stdin;
\.


--
-- Data for Name: hero_section_background_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hero_section_background_images (_order, _parent_id, id, image_id) FROM stdin;
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_applications (id, job_opening_id, first_name, last_name, email, phone, location, security_check_consent, years_of_experience, swedish_tech_industry, strategic_plans_experience, resume_id, cover_letter, privacy_policy_consent, future_opportunities_consent, linkedin_url, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: job_applications_language_skills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_applications_language_skills ("order", parent_id, value, id) FROM stdin;
\.


--
-- Data for Name: job_applications_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_applications_rels (id, "order", parent_id, path, media_id) FROM stdin;
\.


--
-- Data for Name: job_openings_attributes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_openings_attributes (_order, _parent_id, id, attribute) FROM stdin;
\.


--
-- Data for Name: job_openings_benefits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_openings_benefits (_order, _parent_id, id, benefit) FROM stdin;
\.


--
-- Data for Name: job_openings_required_skills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_openings_required_skills (_order, _parent_id, id, skill) FROM stdin;
\.


--
-- Data for Name: job_openings_responsibilities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_openings_responsibilities (_order, _parent_id, id, responsibility) FROM stdin;
\.


--
-- Data for Name: jobs_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs_section (id, background_image_id, heading, description, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: jobs_section_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs_section_rels (id, "order", parent_id, path, job_openings_id) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents (id, global_slug, updated_at, created_at) FROM stdin;
1	hero-section	2025-12-09 22:25:52.923+05:30	2025-12-09 22:25:52.923+05:30
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, slug, title, description, hero_image_id, hero_alt, hero_tagline, hero_title, hero_subtitle, sub_service_title, sub_service_description, cta_title, cta_description, advantages_title, advantages_description, case_studies_label, case_studies_hero_title, case_studies_intro, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: sub_services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sub_services (id, slug, title, description, "order", hero_image_id, hero_title, hero_subtitle, importance_title, importance_description, importance_image_id, download_banner_title, download_banner_description, download_banner_button_text, download_banner_button_link, download_banner_image_id, challenges_title, challenges_description, challenges_button_text, challenges_button_link, benefits_title, benefits_description, benefits_conclusion, benefits_button_text, benefits_button_link, core_features_title, core_features_description, core_features_image_id, iga_services_title, iga_services_description, success_stories_title, success_stories_description, success_stories_cta_text, success_stories_cta_link, success_stories_background_image_id, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until) FROM stdin;
1	2025-12-09 14:13:20.746+05:30	2025-12-09 14:13:20.746+05:30	admin@ncg.com	\N	\N	39646cdf727432553c79cc499471c4a5b9afa3bb1c3051ed84c3b082deeaabe3	e1b02368c4163304107f02523fa4cfb5607185f201d06b2e312cd969f30ea8f74c46b85bb69106f5e779fa505648883ff45d370d9a81fb37d54d4c494d45e1d2238728d98b54c37fcae254a280f9917efe99b1f2e125bbfc83589acb55d271cf0fe3c8dcdb803007efb8acc0aa78b5314eb9e5916afc2e1a9d8643a931c715f70363f066c0f864c47491b62fcd5a15cfc2c63739926b311b4357fe4bfafa3c8d3d8be82ac39cb2080f2cafde2a166ded9fbdabbaf908bde310450c96e3322d2b5053fc084a85533bc8a29fe65d24eed16566681731bb520e890cb1be2255751ac779aa307f49df718cdb69d6d6b345802f5db46ff3e3665ded1399631b3d84f341eac830eff52edb35f5a9716f658efd7ac23b3e47222826b16545a9cfb3514c3bcb64b7efd73539f43b6c292c31eaad590754c01fb37b47a0815e94ea0cf9037c03585438ffe0c77a8f826ed56cca7e0f1bc0e6368607c3c5d77fc9e6745ef800a94e267174c007fa97ee21a86c915735ee413b9d5e75534a8b73289d382fc0153ed59ec35542b6fbcf9c670beabf7f3beaa0c1805c0cd478b713025fbedd6ab8fb48e2f3e170d9cd5d9d6687277b89466dda313c8e06a3ac2ec81e2ec01f989ccc2c858949be1f3d9982449be7e23585bd0d8ad5d02249205238a5979a325234aac78a95db3e14208ad65c05de4b5fb8244ccdbffe21dbb103cac8b2e127d0	0	\N
\.


--
-- Data for Name: payload_locked_documents_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents_rels (id, "order", parent_id, path, users_id, media_id, case_studies_id, blogs_id, icons_id, job_openings_id, job_applications_id, services_id, sub_services_id) FROM stdin;
1	\N	1	user	1	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: payload_preferences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_preferences (id, key, value, updated_at, created_at) FROM stdin;
1	global-hero-section	{"editViewType": "default"}	2025-12-09 14:15:37.849+05:30	2025-12-09 14:15:37.849+05:30
2	collection-services	{"editViewType": "default"}	2025-12-09 14:16:02.1+05:30	2025-12-09 14:15:58.296+05:30
\.


--
-- Data for Name: payload_preferences_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_preferences_rels (id, "order", parent_id, path, users_id) FROM stdin;
1	\N	1	user	1
3	\N	2	user	1
\.


--
-- Data for Name: privacy_policy_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.privacy_policy_section (id, hero_background_image_id, hero_title, hero_effective_date, introduction, cookies_policy_introduction, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: privacy_policy_section_cookies_policy_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.privacy_policy_section_cookies_policy_sections (_order, _parent_id, id, title, content) FROM stdin;
\.


--
-- Data for Name: privacy_policy_section_privacy_policy_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.privacy_policy_section_privacy_policy_sections (_order, _parent_id, id, title, content) FROM stdin;
\.


--
-- Data for Name: services_advantages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services_advantages (_order, _parent_id, id, title, description, image_id) FROM stdin;
\.


--
-- Data for Name: services_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services_rels (id, "order", parent_id, path, case_studies_id, sub_services_id) FROM stdin;
\.


--
-- Data for Name: services_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services_section (id, section_title, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: services_section_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services_section_rels (id, "order", parent_id, path, sub_services_id) FROM stdin;
\.


--
-- Data for Name: services_section_services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services_section_services (_order, _parent_id, id, service_id) FROM stdin;
\.


--
-- Data for Name: sub_services_advantages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sub_services_advantages (_order, _parent_id, id, title, description, image_id) FROM stdin;
\.


--
-- Data for Name: sub_services_challenges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sub_services_challenges (_order, _parent_id, id, number, title, description, image_id) FROM stdin;
\.


--
-- Data for Name: sub_services_core_features; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sub_services_core_features (_order, _parent_id, id, title, description) FROM stdin;
\.


--
-- Data for Name: sub_services_iga_services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sub_services_iga_services (_order, _parent_id, id, number, title, description, background_image_id) FROM stdin;
\.


--
-- Data for Name: sub_services_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sub_services_rels (id, "order", parent_id, path, services_id) FROM stdin;
\.


--
-- Data for Name: testimonials_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonials_section (id, overline, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: testimonials_section_testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonials_section_testimonials (_order, _parent_id, id, name, "position", company, image_id, quote) FROM stdin;
\.


--
-- Data for Name: trusted_by_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trusted_by_section (id, overline, heading, description, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: trusted_by_section_clients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trusted_by_section_clients (_order, _parent_id, id, name, logo_id) FROM stdin;
\.


--
-- Data for Name: users_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_sessions (_order, _parent_id, id, created_at, expires_at) FROM stdin;
1	1	966a277e-b73a-4e9d-b6ab-17aa9f8772ff	2025-12-09 22:25:38.279+05:30	2025-12-10 00:25:38.279+05:30
\.


--
-- Name: about_core_values_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.about_core_values_section_id_seq', 1, false);


--
-- Name: about_cta_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.about_cta_section_id_seq', 1, false);


--
-- Name: about_hero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.about_hero_id_seq', 1, false);


--
-- Name: about_mission_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.about_mission_section_id_seq', 1, false);


--
-- Name: about_stats_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.about_stats_section_id_seq', 1, false);


--
-- Name: about_team_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.about_team_section_id_seq', 1, false);


--
-- Name: about_us_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.about_us_section_id_seq', 1, false);


--
-- Name: approach_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.approach_section_id_seq', 1, false);


--
-- Name: blogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blogs_id_seq', 1, false);


--
-- Name: blogs_page_hero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blogs_page_hero_id_seq', 1, false);


--
-- Name: career_find_place_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_find_place_id_seq', 1, false);


--
-- Name: career_hero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_hero_id_seq', 1, false);


--
-- Name: career_job_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_job_section_id_seq', 1, false);


--
-- Name: career_job_section_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_job_section_rels_id_seq', 1, false);


--
-- Name: career_life_at_ncg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_life_at_ncg_id_seq', 1, false);


--
-- Name: career_spotify_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_spotify_id_seq', 1, false);


--
-- Name: career_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_stats_id_seq', 1, false);


--
-- Name: career_testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_testimonials_id_seq', 1, false);


--
-- Name: career_work_here_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_work_here_id_seq', 1, false);


--
-- Name: case_studies_grid_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.case_studies_grid_id_seq', 1, false);


--
-- Name: case_studies_grid_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.case_studies_grid_rels_id_seq', 1, false);


--
-- Name: case_studies_hero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.case_studies_hero_id_seq', 1, false);


--
-- Name: case_studies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.case_studies_id_seq', 1, false);


--
-- Name: case_studies_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.case_studies_page_id_seq', 1, false);


--
-- Name: case_studies_page_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.case_studies_page_rels_id_seq', 1, false);


--
-- Name: contact_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_section_id_seq', 1, false);


--
-- Name: footer_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.footer_section_id_seq', 1, false);


--
-- Name: hero_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hero_section_id_seq', 1, false);


--
-- Name: icons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.icons_id_seq', 1, false);


--
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 1, false);


--
-- Name: job_applications_language_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.job_applications_language_skills_id_seq', 1, false);


--
-- Name: job_applications_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.job_applications_rels_id_seq', 1, false);


--
-- Name: job_openings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.job_openings_id_seq', 1, false);


--
-- Name: jobs_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_section_id_seq', 1, false);


--
-- Name: jobs_section_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_section_rels_id_seq', 1, false);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_id_seq', 1, false);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_id_seq', 1, true);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_rels_id_seq', 1, true);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_migrations_id_seq', 2, true);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_id_seq', 2, true);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_rels_id_seq', 3, true);


--
-- Name: privacy_policy_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.privacy_policy_section_id_seq', 1, false);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 1, false);


--
-- Name: services_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_rels_id_seq', 1, false);


--
-- Name: services_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_section_id_seq', 1, false);


--
-- Name: services_section_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_section_rels_id_seq', 1, false);


--
-- Name: sub_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sub_services_id_seq', 1, false);


--
-- Name: sub_services_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sub_services_rels_id_seq', 1, false);


--
-- Name: testimonials_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.testimonials_section_id_seq', 1, false);


--
-- Name: trusted_by_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.trusted_by_section_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 7TzhM4PoUtPmRGUiwcy1lcNrNatEqZjgAghe0BdkveyxKVvqj0xExOAbHauQ7I2

