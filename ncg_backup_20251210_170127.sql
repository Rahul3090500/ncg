--
-- PostgreSQL database dump
--

\restrict kpQKEtdRCdoGlcXU6rYgAMQcuo23izpvmJsTKcqCBMYFXKWowu4Oage7eg9MbMV

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

ALTER TABLE IF EXISTS ONLY public.users_sessions DROP CONSTRAINT IF EXISTS users_sessions_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.trusted_by_section_clients DROP CONSTRAINT IF EXISTS trusted_by_section_clients_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.trusted_by_section_clients DROP CONSTRAINT IF EXISTS trusted_by_section_clients_logo_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.testimonials_section_testimonials DROP CONSTRAINT IF EXISTS testimonials_section_testimonials_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.testimonials_section_testimonials DROP CONSTRAINT IF EXISTS testimonials_section_testimonials_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services DROP CONSTRAINT IF EXISTS sub_services_success_stories_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services_rels DROP CONSTRAINT IF EXISTS sub_services_rels_services_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services_rels DROP CONSTRAINT IF EXISTS sub_services_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services DROP CONSTRAINT IF EXISTS sub_services_importance_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services_iga_services DROP CONSTRAINT IF EXISTS sub_services_iga_services_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services_iga_services DROP CONSTRAINT IF EXISTS sub_services_iga_services_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services DROP CONSTRAINT IF EXISTS sub_services_hero_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services DROP CONSTRAINT IF EXISTS sub_services_download_banner_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services_core_features DROP CONSTRAINT IF EXISTS sub_services_core_features_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services DROP CONSTRAINT IF EXISTS sub_services_core_features_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services_challenges DROP CONSTRAINT IF EXISTS sub_services_challenges_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services_challenges DROP CONSTRAINT IF EXISTS sub_services_challenges_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services_advantages DROP CONSTRAINT IF EXISTS sub_services_advantages_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.sub_services_advantages DROP CONSTRAINT IF EXISTS sub_services_advantages_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.services_section_services DROP CONSTRAINT IF EXISTS services_section_services_service_id_services_id_fk;
ALTER TABLE IF EXISTS ONLY public.services_section_services DROP CONSTRAINT IF EXISTS services_section_services_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.services_section_rels DROP CONSTRAINT IF EXISTS services_section_rels_sub_services_fk;
ALTER TABLE IF EXISTS ONLY public.services_section_rels DROP CONSTRAINT IF EXISTS services_section_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.services_rels DROP CONSTRAINT IF EXISTS services_rels_sub_services_fk;
ALTER TABLE IF EXISTS ONLY public.services_rels DROP CONSTRAINT IF EXISTS services_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.services_rels DROP CONSTRAINT IF EXISTS services_rels_case_studies_fk;
ALTER TABLE IF EXISTS ONLY public.services DROP CONSTRAINT IF EXISTS services_hero_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.services_advantages DROP CONSTRAINT IF EXISTS services_advantages_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.services_advantages DROP CONSTRAINT IF EXISTS services_advantages_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.privacy_policy_section_privacy_policy_sections DROP CONSTRAINT IF EXISTS privacy_policy_section_privacy_policy_sections_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.privacy_policy_section DROP CONSTRAINT IF EXISTS privacy_policy_section_hero_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.privacy_policy_section_cookies_policy_sections DROP CONSTRAINT IF EXISTS privacy_policy_section_cookies_policy_sections_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_users_fk;
ALTER TABLE IF EXISTS ONLY public.payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_users_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_sub_services_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_services_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_media_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_job_openings_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_job_applications_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_icons_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_case_studies_fk;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_blogs_fk;
ALTER TABLE IF EXISTS ONLY public.jobs_section_rels DROP CONSTRAINT IF EXISTS jobs_section_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.jobs_section_rels DROP CONSTRAINT IF EXISTS jobs_section_rels_job_openings_fk;
ALTER TABLE IF EXISTS ONLY public.jobs_section DROP CONSTRAINT IF EXISTS jobs_section_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.job_openings_responsibilities DROP CONSTRAINT IF EXISTS job_openings_responsibilities_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.job_openings_required_skills DROP CONSTRAINT IF EXISTS job_openings_required_skills_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.job_openings DROP CONSTRAINT IF EXISTS job_openings_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.job_openings DROP CONSTRAINT IF EXISTS job_openings_hero_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.job_openings_benefits DROP CONSTRAINT IF EXISTS job_openings_benefits_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.job_openings_attributes DROP CONSTRAINT IF EXISTS job_openings_attributes_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.job_applications DROP CONSTRAINT IF EXISTS job_applications_resume_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.job_applications_rels DROP CONSTRAINT IF EXISTS job_applications_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.job_applications_rels DROP CONSTRAINT IF EXISTS job_applications_rels_media_fk;
ALTER TABLE IF EXISTS ONLY public.job_applications_language_skills DROP CONSTRAINT IF EXISTS job_applications_language_skills_parent_fk;
ALTER TABLE IF EXISTS ONLY public.job_applications DROP CONSTRAINT IF EXISTS job_applications_job_opening_id_job_openings_id_fk;
ALTER TABLE IF EXISTS ONLY public.icons DROP CONSTRAINT IF EXISTS icons_svg_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.hero_section_background_images DROP CONSTRAINT IF EXISTS hero_section_background_images_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.hero_section_background_images DROP CONSTRAINT IF EXISTS hero_section_background_images_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.hero_section DROP CONSTRAINT IF EXISTS hero_section_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.hero_section_animated_texts DROP CONSTRAINT IF EXISTS hero_section_animated_texts_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.contact_section DROP CONSTRAINT IF EXISTS contact_section_team_member_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.contact_section_team_member_certifications DROP CONSTRAINT IF EXISTS contact_section_team_member_certifications_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_value_delivered_value_cards DROP CONSTRAINT IF EXISTS case_studies_value_delivered_value_cards_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_value_delivered_value_cards DROP CONSTRAINT IF EXISTS case_studies_value_delivered_value_cards_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_solutions_implemented_solution_items DROP CONSTRAINT IF EXISTS case_studies_solutions_implemented_solution_items_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies DROP CONSTRAINT IF EXISTS case_studies_solutions_implemented_icon_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_solution_tags DROP CONSTRAINT IF EXISTS case_studies_solution_tags_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_page_rels DROP CONSTRAINT IF EXISTS case_studies_page_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_page_rels DROP CONSTRAINT IF EXISTS case_studies_page_rels_case_studies_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_page DROP CONSTRAINT IF EXISTS case_studies_page_hero_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies DROP CONSTRAINT IF EXISTS case_studies_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies DROP CONSTRAINT IF EXISTS case_studies_icon_id_icons_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_how_n_c_g_helped_solutions DROP CONSTRAINT IF EXISTS case_studies_how_n_c_g_helped_solutions_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_how_n_c_g_helped_solutions DROP CONSTRAINT IF EXISTS case_studies_how_n_c_g_helped_solutions_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies DROP CONSTRAINT IF EXISTS case_studies_hero_logo_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_hero DROP CONSTRAINT IF EXISTS case_studies_hero_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies DROP CONSTRAINT IF EXISTS case_studies_hero_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_grid_rels DROP CONSTRAINT IF EXISTS case_studies_grid_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_grid_rels DROP CONSTRAINT IF EXISTS case_studies_grid_rels_case_studies_fk;
ALTER TABLE IF EXISTS ONLY public.case_studies_challenges_challenge_items DROP CONSTRAINT IF EXISTS case_studies_challenges_challenge_items_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_work_here_cards DROP CONSTRAINT IF EXISTS career_work_here_cards_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_work_here_cards DROP CONSTRAINT IF EXISTS career_work_here_cards_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_testimonials_testimonials DROP CONSTRAINT IF EXISTS career_testimonials_testimonials_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_testimonials_testimonials DROP CONSTRAINT IF EXISTS career_testimonials_testimonials_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_stats_stats DROP CONSTRAINT IF EXISTS career_stats_stats_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_spotify DROP CONSTRAINT IF EXISTS career_spotify_icon_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_life_at_ncg_images DROP CONSTRAINT IF EXISTS career_life_at_ncg_images_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_life_at_ncg_images DROP CONSTRAINT IF EXISTS career_life_at_ncg_images_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_job_section_rels DROP CONSTRAINT IF EXISTS career_job_section_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.career_job_section_rels DROP CONSTRAINT IF EXISTS career_job_section_rels_job_openings_fk;
ALTER TABLE IF EXISTS ONLY public.career_hero DROP CONSTRAINT IF EXISTS career_hero_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_find_place_paragraphs DROP CONSTRAINT IF EXISTS career_find_place_paragraphs_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.career_find_place DROP CONSTRAINT IF EXISTS career_find_place_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.blogs_page_hero DROP CONSTRAINT IF EXISTS blogs_page_hero_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.blogs DROP CONSTRAINT IF EXISTS blogs_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.blogs DROP CONSTRAINT IF EXISTS blogs_hero_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.blogs_content_sections DROP CONSTRAINT IF EXISTS blogs_content_sections_section_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.blogs_content_sections DROP CONSTRAINT IF EXISTS blogs_content_sections_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.blogs_content_sections_paragraphs DROP CONSTRAINT IF EXISTS blogs_content_sections_paragraphs_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.blogs_content_sections_numbered_items DROP CONSTRAINT IF EXISTS blogs_content_sections_numbered_items_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.blogs_content_sections_bullet_items DROP CONSTRAINT IF EXISTS blogs_content_sections_bullet_items_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.approach_section_steps DROP CONSTRAINT IF EXISTS approach_section_steps_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.approach_section_steps DROP CONSTRAINT IF EXISTS approach_section_steps_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_us_section_paragraphs DROP CONSTRAINT IF EXISTS about_us_section_paragraphs_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_us_section DROP CONSTRAINT IF EXISTS about_us_section_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_team_section_members DROP CONSTRAINT IF EXISTS about_team_section_members_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_team_section_members DROP CONSTRAINT IF EXISTS about_team_section_members_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_stats_section_stats DROP CONSTRAINT IF EXISTS about_stats_section_stats_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_hero DROP CONSTRAINT IF EXISTS about_hero_background_video_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_cta_section DROP CONSTRAINT IF EXISTS about_cta_section_background_image_id_media_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_core_values_section_values DROP CONSTRAINT IF EXISTS about_core_values_section_values_parent_id_fk;
ALTER TABLE IF EXISTS ONLY public.about_core_values_section_values DROP CONSTRAINT IF EXISTS about_core_values_section_values_icon_id_media_id_fk;
DROP INDEX IF EXISTS public.users_updated_at_idx;
DROP INDEX IF EXISTS public.users_sessions_parent_id_idx;
DROP INDEX IF EXISTS public.users_sessions_order_idx;
DROP INDEX IF EXISTS public.users_email_idx;
DROP INDEX IF EXISTS public.users_created_at_idx;
DROP INDEX IF EXISTS public.trusted_by_section_clients_parent_id_idx;
DROP INDEX IF EXISTS public.trusted_by_section_clients_order_idx;
DROP INDEX IF EXISTS public.trusted_by_section_clients_logo_idx;
DROP INDEX IF EXISTS public.testimonials_section_testimonials_parent_id_idx;
DROP INDEX IF EXISTS public.testimonials_section_testimonials_order_idx;
DROP INDEX IF EXISTS public.testimonials_section_testimonials_image_idx;
DROP INDEX IF EXISTS public.sub_services_updated_at_idx;
DROP INDEX IF EXISTS public.sub_services_success_stories_background_image_idx;
DROP INDEX IF EXISTS public.sub_services_slug_idx;
DROP INDEX IF EXISTS public.sub_services_rels_services_id_idx;
DROP INDEX IF EXISTS public.sub_services_rels_path_idx;
DROP INDEX IF EXISTS public.sub_services_rels_parent_idx;
DROP INDEX IF EXISTS public.sub_services_rels_order_idx;
DROP INDEX IF EXISTS public.sub_services_importance_image_idx;
DROP INDEX IF EXISTS public.sub_services_iga_services_parent_id_idx;
DROP INDEX IF EXISTS public.sub_services_iga_services_order_idx;
DROP INDEX IF EXISTS public.sub_services_iga_services_background_image_idx;
DROP INDEX IF EXISTS public.sub_services_hero_image_idx;
DROP INDEX IF EXISTS public.sub_services_download_banner_image_idx;
DROP INDEX IF EXISTS public.sub_services_created_at_idx;
DROP INDEX IF EXISTS public.sub_services_core_features_parent_id_idx;
DROP INDEX IF EXISTS public.sub_services_core_features_order_idx;
DROP INDEX IF EXISTS public.sub_services_core_features_image_idx;
DROP INDEX IF EXISTS public.sub_services_challenges_parent_id_idx;
DROP INDEX IF EXISTS public.sub_services_challenges_order_idx;
DROP INDEX IF EXISTS public.sub_services_challenges_image_idx;
DROP INDEX IF EXISTS public.sub_services_advantages_parent_id_idx;
DROP INDEX IF EXISTS public.sub_services_advantages_order_idx;
DROP INDEX IF EXISTS public.sub_services_advantages_image_idx;
DROP INDEX IF EXISTS public.services_updated_at_idx;
DROP INDEX IF EXISTS public.services_slug_idx;
DROP INDEX IF EXISTS public.services_section_services_service_idx;
DROP INDEX IF EXISTS public.services_section_services_parent_id_idx;
DROP INDEX IF EXISTS public.services_section_services_order_idx;
DROP INDEX IF EXISTS public.services_section_rels_sub_services_id_idx;
DROP INDEX IF EXISTS public.services_section_rels_path_idx;
DROP INDEX IF EXISTS public.services_section_rels_parent_idx;
DROP INDEX IF EXISTS public.services_section_rels_order_idx;
DROP INDEX IF EXISTS public.services_rels_sub_services_id_idx;
DROP INDEX IF EXISTS public.services_rels_path_idx;
DROP INDEX IF EXISTS public.services_rels_parent_idx;
DROP INDEX IF EXISTS public.services_rels_order_idx;
DROP INDEX IF EXISTS public.services_rels_case_studies_id_idx;
DROP INDEX IF EXISTS public.services_hero_image_idx;
DROP INDEX IF EXISTS public.services_created_at_idx;
DROP INDEX IF EXISTS public.services_advantages_parent_id_idx;
DROP INDEX IF EXISTS public.services_advantages_order_idx;
DROP INDEX IF EXISTS public.services_advantages_image_idx;
DROP INDEX IF EXISTS public.privacy_policy_section_privacy_policy_sections_parent_id_idx;
DROP INDEX IF EXISTS public.privacy_policy_section_privacy_policy_sections_order_idx;
DROP INDEX IF EXISTS public.privacy_policy_section_hero_hero_background_image_idx;
DROP INDEX IF EXISTS public.privacy_policy_section_cookies_policy_sections_parent_id_idx;
DROP INDEX IF EXISTS public.privacy_policy_section_cookies_policy_sections_order_idx;
DROP INDEX IF EXISTS public.payload_preferences_updated_at_idx;
DROP INDEX IF EXISTS public.payload_preferences_rels_users_id_idx;
DROP INDEX IF EXISTS public.payload_preferences_rels_path_idx;
DROP INDEX IF EXISTS public.payload_preferences_rels_parent_idx;
DROP INDEX IF EXISTS public.payload_preferences_rels_order_idx;
DROP INDEX IF EXISTS public.payload_preferences_key_idx;
DROP INDEX IF EXISTS public.payload_preferences_created_at_idx;
DROP INDEX IF EXISTS public.payload_migrations_updated_at_idx;
DROP INDEX IF EXISTS public.payload_migrations_created_at_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_updated_at_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_users_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_sub_services_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_services_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_path_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_parent_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_order_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_media_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_job_openings_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_job_applications_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_icons_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_case_studies_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_rels_blogs_id_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_global_slug_idx;
DROP INDEX IF EXISTS public.payload_locked_documents_created_at_idx;
DROP INDEX IF EXISTS public.media_updated_at_idx;
DROP INDEX IF EXISTS public.media_filename_idx;
DROP INDEX IF EXISTS public.media_created_at_idx;
DROP INDEX IF EXISTS public.jobs_section_rels_path_idx;
DROP INDEX IF EXISTS public.jobs_section_rels_parent_idx;
DROP INDEX IF EXISTS public.jobs_section_rels_order_idx;
DROP INDEX IF EXISTS public.jobs_section_rels_job_openings_id_idx;
DROP INDEX IF EXISTS public.jobs_section_background_image_idx;
DROP INDEX IF EXISTS public.job_openings_updated_at_idx;
DROP INDEX IF EXISTS public.job_openings_slug_idx;
DROP INDEX IF EXISTS public.job_openings_responsibilities_parent_id_idx;
DROP INDEX IF EXISTS public.job_openings_responsibilities_order_idx;
DROP INDEX IF EXISTS public.job_openings_required_skills_parent_id_idx;
DROP INDEX IF EXISTS public.job_openings_required_skills_order_idx;
DROP INDEX IF EXISTS public.job_openings_image_idx;
DROP INDEX IF EXISTS public.job_openings_hero_image_idx;
DROP INDEX IF EXISTS public.job_openings_created_at_idx;
DROP INDEX IF EXISTS public.job_openings_benefits_parent_id_idx;
DROP INDEX IF EXISTS public.job_openings_benefits_order_idx;
DROP INDEX IF EXISTS public.job_openings_attributes_parent_id_idx;
DROP INDEX IF EXISTS public.job_openings_attributes_order_idx;
DROP INDEX IF EXISTS public.job_applications_updated_at_idx;
DROP INDEX IF EXISTS public.job_applications_resume_idx;
DROP INDEX IF EXISTS public.job_applications_rels_path_idx;
DROP INDEX IF EXISTS public.job_applications_rels_parent_idx;
DROP INDEX IF EXISTS public.job_applications_rels_order_idx;
DROP INDEX IF EXISTS public.job_applications_rels_media_id_idx;
DROP INDEX IF EXISTS public.job_applications_language_skills_parent_idx;
DROP INDEX IF EXISTS public.job_applications_language_skills_order_idx;
DROP INDEX IF EXISTS public.job_applications_job_opening_idx;
DROP INDEX IF EXISTS public.job_applications_created_at_idx;
DROP INDEX IF EXISTS public.icons_updated_at_idx;
DROP INDEX IF EXISTS public.icons_svg_idx;
DROP INDEX IF EXISTS public.icons_created_at_idx;
DROP INDEX IF EXISTS public.hero_section_background_images_parent_id_idx;
DROP INDEX IF EXISTS public.hero_section_background_images_order_idx;
DROP INDEX IF EXISTS public.hero_section_background_images_image_idx;
DROP INDEX IF EXISTS public.hero_section_background_image_idx;
DROP INDEX IF EXISTS public.hero_section_animated_texts_parent_id_idx;
DROP INDEX IF EXISTS public.hero_section_animated_texts_order_idx;
DROP INDEX IF EXISTS public.contact_section_team_member_team_member_image_idx;
DROP INDEX IF EXISTS public.contact_section_team_member_certifications_parent_id_idx;
DROP INDEX IF EXISTS public.contact_section_team_member_certifications_order_idx;
DROP INDEX IF EXISTS public.case_studies_value_delivered_value_cards_parent_id_idx;
DROP INDEX IF EXISTS public.case_studies_value_delivered_value_cards_order_idx;
DROP INDEX IF EXISTS public.case_studies_value_delivered_value_cards_image_idx;
DROP INDEX IF EXISTS public.case_studies_updated_at_idx;
DROP INDEX IF EXISTS public.case_studies_solutions_implemented_solutions_implemented_idx;
DROP INDEX IF EXISTS public.case_studies_solutions_implemented_solution_items_parent_id_idx;
DROP INDEX IF EXISTS public.case_studies_solutions_implemented_solution_items_order_idx;
DROP INDEX IF EXISTS public.case_studies_solution_tags_parent_id_idx;
DROP INDEX IF EXISTS public.case_studies_solution_tags_order_idx;
DROP INDEX IF EXISTS public.case_studies_slug_idx;
DROP INDEX IF EXISTS public.case_studies_page_rels_path_idx;
DROP INDEX IF EXISTS public.case_studies_page_rels_parent_idx;
DROP INDEX IF EXISTS public.case_studies_page_rels_order_idx;
DROP INDEX IF EXISTS public.case_studies_page_rels_case_studies_id_idx;
DROP INDEX IF EXISTS public.case_studies_page_hero_hero_background_image_idx;
DROP INDEX IF EXISTS public.case_studies_image_idx;
DROP INDEX IF EXISTS public.case_studies_icon_idx;
DROP INDEX IF EXISTS public.case_studies_how_n_c_g_helped_solutions_parent_id_idx;
DROP INDEX IF EXISTS public.case_studies_how_n_c_g_helped_solutions_order_idx;
DROP INDEX IF EXISTS public.case_studies_how_n_c_g_helped_solutions_image_idx;
DROP INDEX IF EXISTS public.case_studies_hero_logo_idx;
DROP INDEX IF EXISTS public.case_studies_hero_background_image_idx;
DROP INDEX IF EXISTS public.case_studies_hero_background_image_1_idx;
DROP INDEX IF EXISTS public.case_studies_grid_rels_path_idx;
DROP INDEX IF EXISTS public.case_studies_grid_rels_parent_idx;
DROP INDEX IF EXISTS public.case_studies_grid_rels_order_idx;
DROP INDEX IF EXISTS public.case_studies_grid_rels_case_studies_id_idx;
DROP INDEX IF EXISTS public.case_studies_created_at_idx;
DROP INDEX IF EXISTS public.case_studies_challenges_challenge_items_parent_id_idx;
DROP INDEX IF EXISTS public.case_studies_challenges_challenge_items_order_idx;
DROP INDEX IF EXISTS public.career_work_here_cards_parent_id_idx;
DROP INDEX IF EXISTS public.career_work_here_cards_order_idx;
DROP INDEX IF EXISTS public.career_work_here_cards_image_idx;
DROP INDEX IF EXISTS public.career_testimonials_testimonials_parent_id_idx;
DROP INDEX IF EXISTS public.career_testimonials_testimonials_order_idx;
DROP INDEX IF EXISTS public.career_testimonials_testimonials_image_idx;
DROP INDEX IF EXISTS public.career_stats_stats_parent_id_idx;
DROP INDEX IF EXISTS public.career_stats_stats_order_idx;
DROP INDEX IF EXISTS public.career_spotify_icon_idx;
DROP INDEX IF EXISTS public.career_life_at_ncg_images_parent_id_idx;
DROP INDEX IF EXISTS public.career_life_at_ncg_images_order_idx;
DROP INDEX IF EXISTS public.career_life_at_ncg_images_image_idx;
DROP INDEX IF EXISTS public.career_job_section_rels_path_idx;
DROP INDEX IF EXISTS public.career_job_section_rels_parent_idx;
DROP INDEX IF EXISTS public.career_job_section_rels_order_idx;
DROP INDEX IF EXISTS public.career_job_section_rels_job_openings_id_idx;
DROP INDEX IF EXISTS public.career_hero_background_image_idx;
DROP INDEX IF EXISTS public.career_find_place_paragraphs_parent_id_idx;
DROP INDEX IF EXISTS public.career_find_place_paragraphs_order_idx;
DROP INDEX IF EXISTS public.career_find_place_image_idx;
DROP INDEX IF EXISTS public.blogs_updated_at_idx;
DROP INDEX IF EXISTS public.blogs_slug_idx;
DROP INDEX IF EXISTS public.blogs_page_hero_background_image_idx;
DROP INDEX IF EXISTS public.blogs_image_idx;
DROP INDEX IF EXISTS public.blogs_hero_background_image_idx;
DROP INDEX IF EXISTS public.blogs_created_at_idx;
DROP INDEX IF EXISTS public.blogs_content_sections_section_image_idx;
DROP INDEX IF EXISTS public.blogs_content_sections_parent_id_idx;
DROP INDEX IF EXISTS public.blogs_content_sections_paragraphs_parent_id_idx;
DROP INDEX IF EXISTS public.blogs_content_sections_paragraphs_order_idx;
DROP INDEX IF EXISTS public.blogs_content_sections_order_idx;
DROP INDEX IF EXISTS public.blogs_content_sections_numbered_items_parent_id_idx;
DROP INDEX IF EXISTS public.blogs_content_sections_numbered_items_order_idx;
DROP INDEX IF EXISTS public.blogs_content_sections_bullet_items_parent_id_idx;
DROP INDEX IF EXISTS public.blogs_content_sections_bullet_items_order_idx;
DROP INDEX IF EXISTS public.approach_section_steps_parent_id_idx;
DROP INDEX IF EXISTS public.approach_section_steps_order_idx;
DROP INDEX IF EXISTS public.approach_section_steps_image_idx;
DROP INDEX IF EXISTS public.about_us_section_paragraphs_parent_id_idx;
DROP INDEX IF EXISTS public.about_us_section_paragraphs_order_idx;
DROP INDEX IF EXISTS public.about_us_section_image_idx;
DROP INDEX IF EXISTS public.about_team_section_members_parent_id_idx;
DROP INDEX IF EXISTS public.about_team_section_members_order_idx;
DROP INDEX IF EXISTS public.about_team_section_members_image_idx;
DROP INDEX IF EXISTS public.about_stats_section_stats_parent_id_idx;
DROP INDEX IF EXISTS public.about_stats_section_stats_order_idx;
DROP INDEX IF EXISTS public.about_hero_background_video_idx;
DROP INDEX IF EXISTS public.about_cta_section_background_image_idx;
DROP INDEX IF EXISTS public.about_core_values_section_values_parent_id_idx;
DROP INDEX IF EXISTS public.about_core_values_section_values_order_idx;
DROP INDEX IF EXISTS public.about_core_values_section_values_icon_idx;
ALTER TABLE IF EXISTS ONLY public.users_sessions DROP CONSTRAINT IF EXISTS users_sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.trusted_by_section DROP CONSTRAINT IF EXISTS trusted_by_section_pkey;
ALTER TABLE IF EXISTS ONLY public.trusted_by_section_clients DROP CONSTRAINT IF EXISTS trusted_by_section_clients_pkey;
ALTER TABLE IF EXISTS ONLY public.testimonials_section_testimonials DROP CONSTRAINT IF EXISTS testimonials_section_testimonials_pkey;
ALTER TABLE IF EXISTS ONLY public.testimonials_section DROP CONSTRAINT IF EXISTS testimonials_section_pkey;
ALTER TABLE IF EXISTS ONLY public.sub_services_rels DROP CONSTRAINT IF EXISTS sub_services_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.sub_services DROP CONSTRAINT IF EXISTS sub_services_pkey;
ALTER TABLE IF EXISTS ONLY public.sub_services_iga_services DROP CONSTRAINT IF EXISTS sub_services_iga_services_pkey;
ALTER TABLE IF EXISTS ONLY public.sub_services_core_features DROP CONSTRAINT IF EXISTS sub_services_core_features_pkey;
ALTER TABLE IF EXISTS ONLY public.sub_services_challenges DROP CONSTRAINT IF EXISTS sub_services_challenges_pkey;
ALTER TABLE IF EXISTS ONLY public.sub_services_advantages DROP CONSTRAINT IF EXISTS sub_services_advantages_pkey;
ALTER TABLE IF EXISTS ONLY public.services_section_services DROP CONSTRAINT IF EXISTS services_section_services_pkey;
ALTER TABLE IF EXISTS ONLY public.services_section_rels DROP CONSTRAINT IF EXISTS services_section_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.services_section DROP CONSTRAINT IF EXISTS services_section_pkey;
ALTER TABLE IF EXISTS ONLY public.services_rels DROP CONSTRAINT IF EXISTS services_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.services DROP CONSTRAINT IF EXISTS services_pkey;
ALTER TABLE IF EXISTS ONLY public.services_advantages DROP CONSTRAINT IF EXISTS services_advantages_pkey;
ALTER TABLE IF EXISTS ONLY public.privacy_policy_section_privacy_policy_sections DROP CONSTRAINT IF EXISTS privacy_policy_section_privacy_policy_sections_pkey;
ALTER TABLE IF EXISTS ONLY public.privacy_policy_section DROP CONSTRAINT IF EXISTS privacy_policy_section_pkey;
ALTER TABLE IF EXISTS ONLY public.privacy_policy_section_cookies_policy_sections DROP CONSTRAINT IF EXISTS privacy_policy_section_cookies_policy_sections_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_preferences DROP CONSTRAINT IF EXISTS payload_preferences_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_migrations DROP CONSTRAINT IF EXISTS payload_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.payload_locked_documents DROP CONSTRAINT IF EXISTS payload_locked_documents_pkey;
ALTER TABLE IF EXISTS ONLY public.media DROP CONSTRAINT IF EXISTS media_pkey;
ALTER TABLE IF EXISTS ONLY public.jobs_section_rels DROP CONSTRAINT IF EXISTS jobs_section_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.jobs_section DROP CONSTRAINT IF EXISTS jobs_section_pkey;
ALTER TABLE IF EXISTS ONLY public.job_openings_responsibilities DROP CONSTRAINT IF EXISTS job_openings_responsibilities_pkey;
ALTER TABLE IF EXISTS ONLY public.job_openings_required_skills DROP CONSTRAINT IF EXISTS job_openings_required_skills_pkey;
ALTER TABLE IF EXISTS ONLY public.job_openings DROP CONSTRAINT IF EXISTS job_openings_pkey;
ALTER TABLE IF EXISTS ONLY public.job_openings_benefits DROP CONSTRAINT IF EXISTS job_openings_benefits_pkey;
ALTER TABLE IF EXISTS ONLY public.job_openings_attributes DROP CONSTRAINT IF EXISTS job_openings_attributes_pkey;
ALTER TABLE IF EXISTS ONLY public.job_applications_rels DROP CONSTRAINT IF EXISTS job_applications_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.job_applications DROP CONSTRAINT IF EXISTS job_applications_pkey;
ALTER TABLE IF EXISTS ONLY public.job_applications_language_skills DROP CONSTRAINT IF EXISTS job_applications_language_skills_pkey;
ALTER TABLE IF EXISTS ONLY public.icons DROP CONSTRAINT IF EXISTS icons_pkey;
ALTER TABLE IF EXISTS ONLY public.hero_section DROP CONSTRAINT IF EXISTS hero_section_pkey;
ALTER TABLE IF EXISTS ONLY public.hero_section_background_images DROP CONSTRAINT IF EXISTS hero_section_background_images_pkey;
ALTER TABLE IF EXISTS ONLY public.hero_section_animated_texts DROP CONSTRAINT IF EXISTS hero_section_animated_texts_pkey;
ALTER TABLE IF EXISTS ONLY public.footer_section DROP CONSTRAINT IF EXISTS footer_section_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_section_team_member_certifications DROP CONSTRAINT IF EXISTS contact_section_team_member_certifications_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_section DROP CONSTRAINT IF EXISTS contact_section_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies_value_delivered_value_cards DROP CONSTRAINT IF EXISTS case_studies_value_delivered_value_cards_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies_solutions_implemented_solution_items DROP CONSTRAINT IF EXISTS case_studies_solutions_implemented_solution_items_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies_solution_tags DROP CONSTRAINT IF EXISTS case_studies_solution_tags_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies DROP CONSTRAINT IF EXISTS case_studies_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies_page_rels DROP CONSTRAINT IF EXISTS case_studies_page_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies_page DROP CONSTRAINT IF EXISTS case_studies_page_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies_how_n_c_g_helped_solutions DROP CONSTRAINT IF EXISTS case_studies_how_n_c_g_helped_solutions_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies_hero DROP CONSTRAINT IF EXISTS case_studies_hero_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies_grid_rels DROP CONSTRAINT IF EXISTS case_studies_grid_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies_grid DROP CONSTRAINT IF EXISTS case_studies_grid_pkey;
ALTER TABLE IF EXISTS ONLY public.case_studies_challenges_challenge_items DROP CONSTRAINT IF EXISTS case_studies_challenges_challenge_items_pkey;
ALTER TABLE IF EXISTS ONLY public.career_work_here DROP CONSTRAINT IF EXISTS career_work_here_pkey;
ALTER TABLE IF EXISTS ONLY public.career_work_here_cards DROP CONSTRAINT IF EXISTS career_work_here_cards_pkey;
ALTER TABLE IF EXISTS ONLY public.career_testimonials_testimonials DROP CONSTRAINT IF EXISTS career_testimonials_testimonials_pkey;
ALTER TABLE IF EXISTS ONLY public.career_testimonials DROP CONSTRAINT IF EXISTS career_testimonials_pkey;
ALTER TABLE IF EXISTS ONLY public.career_stats_stats DROP CONSTRAINT IF EXISTS career_stats_stats_pkey;
ALTER TABLE IF EXISTS ONLY public.career_stats DROP CONSTRAINT IF EXISTS career_stats_pkey;
ALTER TABLE IF EXISTS ONLY public.career_spotify DROP CONSTRAINT IF EXISTS career_spotify_pkey;
ALTER TABLE IF EXISTS ONLY public.career_life_at_ncg DROP CONSTRAINT IF EXISTS career_life_at_ncg_pkey;
ALTER TABLE IF EXISTS ONLY public.career_life_at_ncg_images DROP CONSTRAINT IF EXISTS career_life_at_ncg_images_pkey;
ALTER TABLE IF EXISTS ONLY public.career_job_section_rels DROP CONSTRAINT IF EXISTS career_job_section_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.career_job_section DROP CONSTRAINT IF EXISTS career_job_section_pkey;
ALTER TABLE IF EXISTS ONLY public.career_hero DROP CONSTRAINT IF EXISTS career_hero_pkey;
ALTER TABLE IF EXISTS ONLY public.career_find_place DROP CONSTRAINT IF EXISTS career_find_place_pkey;
ALTER TABLE IF EXISTS ONLY public.career_find_place_paragraphs DROP CONSTRAINT IF EXISTS career_find_place_paragraphs_pkey;
ALTER TABLE IF EXISTS ONLY public.blogs DROP CONSTRAINT IF EXISTS blogs_pkey;
ALTER TABLE IF EXISTS ONLY public.blogs_page_hero DROP CONSTRAINT IF EXISTS blogs_page_hero_pkey;
ALTER TABLE IF EXISTS ONLY public.blogs_content_sections DROP CONSTRAINT IF EXISTS blogs_content_sections_pkey;
ALTER TABLE IF EXISTS ONLY public.blogs_content_sections_paragraphs DROP CONSTRAINT IF EXISTS blogs_content_sections_paragraphs_pkey;
ALTER TABLE IF EXISTS ONLY public.blogs_content_sections_numbered_items DROP CONSTRAINT IF EXISTS blogs_content_sections_numbered_items_pkey;
ALTER TABLE IF EXISTS ONLY public.blogs_content_sections_bullet_items DROP CONSTRAINT IF EXISTS blogs_content_sections_bullet_items_pkey;
ALTER TABLE IF EXISTS ONLY public.approach_section_steps DROP CONSTRAINT IF EXISTS approach_section_steps_pkey;
ALTER TABLE IF EXISTS ONLY public.approach_section DROP CONSTRAINT IF EXISTS approach_section_pkey;
ALTER TABLE IF EXISTS ONLY public.about_us_section DROP CONSTRAINT IF EXISTS about_us_section_pkey;
ALTER TABLE IF EXISTS ONLY public.about_us_section_paragraphs DROP CONSTRAINT IF EXISTS about_us_section_paragraphs_pkey;
ALTER TABLE IF EXISTS ONLY public.about_team_section DROP CONSTRAINT IF EXISTS about_team_section_pkey;
ALTER TABLE IF EXISTS ONLY public.about_team_section_members DROP CONSTRAINT IF EXISTS about_team_section_members_pkey;
ALTER TABLE IF EXISTS ONLY public.about_stats_section_stats DROP CONSTRAINT IF EXISTS about_stats_section_stats_pkey;
ALTER TABLE IF EXISTS ONLY public.about_stats_section DROP CONSTRAINT IF EXISTS about_stats_section_pkey;
ALTER TABLE IF EXISTS ONLY public.about_mission_section DROP CONSTRAINT IF EXISTS about_mission_section_pkey;
ALTER TABLE IF EXISTS ONLY public.about_hero DROP CONSTRAINT IF EXISTS about_hero_pkey;
ALTER TABLE IF EXISTS ONLY public.about_cta_section DROP CONSTRAINT IF EXISTS about_cta_section_pkey;
ALTER TABLE IF EXISTS ONLY public.about_core_values_section_values DROP CONSTRAINT IF EXISTS about_core_values_section_values_pkey;
ALTER TABLE IF EXISTS ONLY public.about_core_values_section DROP CONSTRAINT IF EXISTS about_core_values_section_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.trusted_by_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.testimonials_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sub_services_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sub_services ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.services_section_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.services_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.services_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.services ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.privacy_policy_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_preferences_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_preferences ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_migrations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_locked_documents_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payload_locked_documents ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.media ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.jobs_section_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.jobs_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.job_openings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.job_applications_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.job_applications_language_skills ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.job_applications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.icons ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hero_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.footer_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.contact_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.case_studies_page_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.case_studies_page ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.case_studies_hero ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.case_studies_grid_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.case_studies_grid ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.case_studies ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_work_here ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_testimonials ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_stats ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_spotify ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_life_at_ncg ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_job_section_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_job_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_hero ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_find_place ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blogs_page_hero ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blogs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.approach_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_us_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_team_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_stats_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_mission_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_hero ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_cta_section ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_core_values_section ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.users_sessions;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.trusted_by_section_id_seq;
DROP TABLE IF EXISTS public.trusted_by_section_clients;
DROP TABLE IF EXISTS public.trusted_by_section;
DROP TABLE IF EXISTS public.testimonials_section_testimonials;
DROP SEQUENCE IF EXISTS public.testimonials_section_id_seq;
DROP TABLE IF EXISTS public.testimonials_section;
DROP SEQUENCE IF EXISTS public.sub_services_rels_id_seq;
DROP TABLE IF EXISTS public.sub_services_rels;
DROP TABLE IF EXISTS public.sub_services_iga_services;
DROP SEQUENCE IF EXISTS public.sub_services_id_seq;
DROP TABLE IF EXISTS public.sub_services_core_features;
DROP TABLE IF EXISTS public.sub_services_challenges;
DROP TABLE IF EXISTS public.sub_services_advantages;
DROP TABLE IF EXISTS public.sub_services;
DROP TABLE IF EXISTS public.services_section_services;
DROP SEQUENCE IF EXISTS public.services_section_rels_id_seq;
DROP TABLE IF EXISTS public.services_section_rels;
DROP SEQUENCE IF EXISTS public.services_section_id_seq;
DROP TABLE IF EXISTS public.services_section;
DROP SEQUENCE IF EXISTS public.services_rels_id_seq;
DROP TABLE IF EXISTS public.services_rels;
DROP SEQUENCE IF EXISTS public.services_id_seq;
DROP TABLE IF EXISTS public.services_advantages;
DROP TABLE IF EXISTS public.services;
DROP TABLE IF EXISTS public.privacy_policy_section_privacy_policy_sections;
DROP SEQUENCE IF EXISTS public.privacy_policy_section_id_seq;
DROP TABLE IF EXISTS public.privacy_policy_section_cookies_policy_sections;
DROP TABLE IF EXISTS public.privacy_policy_section;
DROP SEQUENCE IF EXISTS public.payload_preferences_rels_id_seq;
DROP TABLE IF EXISTS public.payload_preferences_rels;
DROP SEQUENCE IF EXISTS public.payload_preferences_id_seq;
DROP TABLE IF EXISTS public.payload_preferences;
DROP SEQUENCE IF EXISTS public.payload_migrations_id_seq;
DROP TABLE IF EXISTS public.payload_migrations;
DROP SEQUENCE IF EXISTS public.payload_locked_documents_rels_id_seq;
DROP TABLE IF EXISTS public.payload_locked_documents_rels;
DROP SEQUENCE IF EXISTS public.payload_locked_documents_id_seq;
DROP TABLE IF EXISTS public.payload_locked_documents;
DROP SEQUENCE IF EXISTS public.media_id_seq;
DROP TABLE IF EXISTS public.media;
DROP SEQUENCE IF EXISTS public.jobs_section_rels_id_seq;
DROP TABLE IF EXISTS public.jobs_section_rels;
DROP SEQUENCE IF EXISTS public.jobs_section_id_seq;
DROP TABLE IF EXISTS public.jobs_section;
DROP TABLE IF EXISTS public.job_openings_responsibilities;
DROP TABLE IF EXISTS public.job_openings_required_skills;
DROP SEQUENCE IF EXISTS public.job_openings_id_seq;
DROP TABLE IF EXISTS public.job_openings_benefits;
DROP TABLE IF EXISTS public.job_openings_attributes;
DROP TABLE IF EXISTS public.job_openings;
DROP SEQUENCE IF EXISTS public.job_applications_rels_id_seq;
DROP TABLE IF EXISTS public.job_applications_rels;
DROP SEQUENCE IF EXISTS public.job_applications_language_skills_id_seq;
DROP TABLE IF EXISTS public.job_applications_language_skills;
DROP SEQUENCE IF EXISTS public.job_applications_id_seq;
DROP TABLE IF EXISTS public.job_applications;
DROP SEQUENCE IF EXISTS public.icons_id_seq;
DROP TABLE IF EXISTS public.icons;
DROP SEQUENCE IF EXISTS public.hero_section_id_seq;
DROP TABLE IF EXISTS public.hero_section_background_images;
DROP TABLE IF EXISTS public.hero_section_animated_texts;
DROP TABLE IF EXISTS public.hero_section;
DROP SEQUENCE IF EXISTS public.footer_section_id_seq;
DROP TABLE IF EXISTS public.footer_section;
DROP TABLE IF EXISTS public.contact_section_team_member_certifications;
DROP SEQUENCE IF EXISTS public.contact_section_id_seq;
DROP TABLE IF EXISTS public.contact_section;
DROP TABLE IF EXISTS public.case_studies_value_delivered_value_cards;
DROP TABLE IF EXISTS public.case_studies_solutions_implemented_solution_items;
DROP TABLE IF EXISTS public.case_studies_solution_tags;
DROP SEQUENCE IF EXISTS public.case_studies_page_rels_id_seq;
DROP TABLE IF EXISTS public.case_studies_page_rels;
DROP SEQUENCE IF EXISTS public.case_studies_page_id_seq;
DROP TABLE IF EXISTS public.case_studies_page;
DROP SEQUENCE IF EXISTS public.case_studies_id_seq;
DROP TABLE IF EXISTS public.case_studies_how_n_c_g_helped_solutions;
DROP SEQUENCE IF EXISTS public.case_studies_hero_id_seq;
DROP TABLE IF EXISTS public.case_studies_hero;
DROP SEQUENCE IF EXISTS public.case_studies_grid_rels_id_seq;
DROP TABLE IF EXISTS public.case_studies_grid_rels;
DROP SEQUENCE IF EXISTS public.case_studies_grid_id_seq;
DROP TABLE IF EXISTS public.case_studies_grid;
DROP TABLE IF EXISTS public.case_studies_challenges_challenge_items;
DROP TABLE IF EXISTS public.case_studies;
DROP SEQUENCE IF EXISTS public.career_work_here_id_seq;
DROP TABLE IF EXISTS public.career_work_here_cards;
DROP TABLE IF EXISTS public.career_work_here;
DROP TABLE IF EXISTS public.career_testimonials_testimonials;
DROP SEQUENCE IF EXISTS public.career_testimonials_id_seq;
DROP TABLE IF EXISTS public.career_testimonials;
DROP TABLE IF EXISTS public.career_stats_stats;
DROP SEQUENCE IF EXISTS public.career_stats_id_seq;
DROP TABLE IF EXISTS public.career_stats;
DROP SEQUENCE IF EXISTS public.career_spotify_id_seq;
DROP TABLE IF EXISTS public.career_spotify;
DROP TABLE IF EXISTS public.career_life_at_ncg_images;
DROP SEQUENCE IF EXISTS public.career_life_at_ncg_id_seq;
DROP TABLE IF EXISTS public.career_life_at_ncg;
DROP SEQUENCE IF EXISTS public.career_job_section_rels_id_seq;
DROP TABLE IF EXISTS public.career_job_section_rels;
DROP SEQUENCE IF EXISTS public.career_job_section_id_seq;
DROP TABLE IF EXISTS public.career_job_section;
DROP SEQUENCE IF EXISTS public.career_hero_id_seq;
DROP TABLE IF EXISTS public.career_hero;
DROP TABLE IF EXISTS public.career_find_place_paragraphs;
DROP SEQUENCE IF EXISTS public.career_find_place_id_seq;
DROP TABLE IF EXISTS public.career_find_place;
DROP SEQUENCE IF EXISTS public.blogs_page_hero_id_seq;
DROP TABLE IF EXISTS public.blogs_page_hero;
DROP SEQUENCE IF EXISTS public.blogs_id_seq;
DROP TABLE IF EXISTS public.blogs_content_sections_paragraphs;
DROP TABLE IF EXISTS public.blogs_content_sections_numbered_items;
DROP TABLE IF EXISTS public.blogs_content_sections_bullet_items;
DROP TABLE IF EXISTS public.blogs_content_sections;
DROP TABLE IF EXISTS public.blogs;
DROP TABLE IF EXISTS public.approach_section_steps;
DROP SEQUENCE IF EXISTS public.approach_section_id_seq;
DROP TABLE IF EXISTS public.approach_section;
DROP TABLE IF EXISTS public.about_us_section_paragraphs;
DROP SEQUENCE IF EXISTS public.about_us_section_id_seq;
DROP TABLE IF EXISTS public.about_us_section;
DROP TABLE IF EXISTS public.about_team_section_members;
DROP SEQUENCE IF EXISTS public.about_team_section_id_seq;
DROP TABLE IF EXISTS public.about_team_section;
DROP TABLE IF EXISTS public.about_stats_section_stats;
DROP SEQUENCE IF EXISTS public.about_stats_section_id_seq;
DROP TABLE IF EXISTS public.about_stats_section;
DROP SEQUENCE IF EXISTS public.about_mission_section_id_seq;
DROP TABLE IF EXISTS public.about_mission_section;
DROP SEQUENCE IF EXISTS public.about_hero_id_seq;
DROP TABLE IF EXISTS public.about_hero;
DROP SEQUENCE IF EXISTS public.about_cta_section_id_seq;
DROP TABLE IF EXISTS public.about_cta_section;
DROP TABLE IF EXISTS public.about_core_values_section_values;
DROP SEQUENCE IF EXISTS public.about_core_values_section_id_seq;
DROP TABLE IF EXISTS public.about_core_values_section;
DROP TYPE IF EXISTS public.enum_job_openings_type;
DROP TYPE IF EXISTS public.enum_job_openings_remote_status;
DROP TYPE IF EXISTS public.enum_job_applications_swedish_tech_industry;
DROP TYPE IF EXISTS public.enum_job_applications_strategic_plans_experience;
DROP TYPE IF EXISTS public.enum_job_applications_security_check_consent;
DROP TYPE IF EXISTS public.enum_job_applications_language_skills;
DROP TYPE IF EXISTS public.enum_case_studies_icon_type;
DROP TYPE IF EXISTS public.enum_blogs_content_sections_section_type;
--
-- Name: enum_blogs_content_sections_section_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_blogs_content_sections_section_type AS ENUM (
    'titleParagraph',
    'bulletList',
    'quote',
    'numberedList',
    'image'
);


--
-- Name: enum_case_studies_icon_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_case_studies_icon_type AS ENUM (
    'realEstate',
    'finance',
    'healthcare'
);


--
-- Name: enum_job_applications_language_skills; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_job_applications_language_skills AS ENUM (
    'swedish',
    'english',
    'finnish',
    'danish',
    'other'
);


--
-- Name: enum_job_applications_security_check_consent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_job_applications_security_check_consent AS ENUM (
    'yes',
    'no'
);


--
-- Name: enum_job_applications_strategic_plans_experience; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_job_applications_strategic_plans_experience AS ENUM (
    'yes',
    'no'
);


--
-- Name: enum_job_applications_swedish_tech_industry; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_job_applications_swedish_tech_industry AS ENUM (
    'yes',
    'no'
);


--
-- Name: enum_job_openings_remote_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_job_openings_remote_status AS ENUM (
    'hybrid',
    'remote',
    'on-site'
);


--
-- Name: enum_job_openings_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_job_openings_type AS ENUM (
    'full-time',
    'part-time',
    'full-time-hybrid',
    'hybrid',
    'remote'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: about_core_values_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_core_values_section (
    id integer NOT NULL,
    title character varying DEFAULT 'Our Core Values'::character varying NOT NULL,
    subtitle character varying DEFAULT 'Complete honesty and transparency'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: about_core_values_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.about_core_values_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: about_core_values_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.about_core_values_section_id_seq OWNED BY public.about_core_values_section.id;


--
-- Name: about_core_values_section_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_core_values_section_values (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    icon_id integer,
    title character varying NOT NULL,
    description character varying NOT NULL
);


--
-- Name: about_cta_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_cta_section (
    id integer NOT NULL,
    title character varying DEFAULT 'Ready To Strengthen Your Cybersecurity?'::character varying NOT NULL,
    description character varying DEFAULT 'Talk directly with our experts to understand your challenges, explore tailored solutions, and take the first step toward a more secure and resilient future.'::character varying NOT NULL,
    button_text character varying DEFAULT 'Contact Us'::character varying NOT NULL,
    button_link character varying DEFAULT '/contact'::character varying NOT NULL,
    background_image_id integer,
    overlay_opacity numeric DEFAULT 0.5 NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: about_cta_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.about_cta_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: about_cta_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.about_cta_section_id_seq OWNED BY public.about_cta_section.id;


--
-- Name: about_hero; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_hero (
    id integer NOT NULL,
    quote character varying DEFAULT 'At Nordic Cyber Group, we don''t just defend against cyber threats—we build the trust, resilience, and strategies that keep your business moving forward, no matter what.'::character varying NOT NULL,
    highlight_words character varying DEFAULT ''::character varying,
    attribution character varying DEFAULT 'NCG TEAM'::character varying NOT NULL,
    background_video_id integer,
    overlay_opacity numeric DEFAULT 0.6 NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: about_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.about_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: about_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.about_hero_id_seq OWNED BY public.about_hero.id;


--
-- Name: about_mission_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_mission_section (
    id integer NOT NULL,
    title character varying DEFAULT 'Our Mission'::character varying NOT NULL,
    description character varying DEFAULT 'To deliver transparent, trusted, and expert-driven cybersecurity services that strengthen resilience, reduce risk, and protect what matters most—your people, your data, and your reputation.'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: about_mission_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.about_mission_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: about_mission_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.about_mission_section_id_seq OWNED BY public.about_mission_section.id;


--
-- Name: about_stats_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_stats_section (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: about_stats_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.about_stats_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: about_stats_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.about_stats_section_id_seq OWNED BY public.about_stats_section.id;


--
-- Name: about_stats_section_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_stats_section_stats (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    value character varying NOT NULL,
    label character varying NOT NULL
);


--
-- Name: about_team_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_team_section (
    id integer NOT NULL,
    title character varying DEFAULT 'Our Team'::character varying NOT NULL,
    description character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: about_team_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.about_team_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: about_team_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.about_team_section_id_seq OWNED BY public.about_team_section.id;


--
-- Name: about_team_section_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_team_section_members (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer,
    name character varying NOT NULL,
    role character varying NOT NULL,
    bio character varying
);


--
-- Name: about_us_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_us_section (
    id integer NOT NULL,
    section_label character varying DEFAULT 'ABOUT US'::character varying NOT NULL,
    heading character varying DEFAULT 'Securing digital futures, one Organization at a Time'::character varying NOT NULL,
    image_id integer,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: about_us_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.about_us_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: about_us_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.about_us_section_id_seq OWNED BY public.about_us_section.id;


--
-- Name: about_us_section_paragraphs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_us_section_paragraphs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    text character varying NOT NULL
);


--
-- Name: approach_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.approach_section (
    id integer NOT NULL,
    title character varying DEFAULT 'Our Approach'::character varying NOT NULL,
    heading character varying DEFAULT 'Embracing the power of simplified cybersecurity'::character varying NOT NULL,
    description character varying DEFAULT 'In an era where digital threats morph and expand daily, we answer not by complicating our defences, but by simplifying them. We''re pioneering a shift: redefining cybersecurity for tomorrow''s challenges.'::character varying NOT NULL,
    button_text character varying DEFAULT 'Contact Us'::character varying NOT NULL,
    button_link character varying DEFAULT '/contact'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: approach_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.approach_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: approach_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.approach_section_id_seq OWNED BY public.approach_section.id;


--
-- Name: approach_section_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.approach_section_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    image_id integer
);


--
-- Name: blogs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying,
    date timestamp(3) with time zone NOT NULL,
    description character varying NOT NULL,
    image_id integer,
    link character varying,
    hero_background_image_id integer,
    read_time character varying DEFAULT '15 Min Read'::character varying,
    enable_social_sharing boolean DEFAULT true,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: blogs_content_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_content_sections (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    section_type public.enum_blogs_content_sections_section_type DEFAULT 'titleParagraph'::public.enum_blogs_content_sections_section_type NOT NULL,
    section_title character varying,
    intro_paragraph character varying,
    quote_text character varying,
    section_image_id integer
);


--
-- Name: blogs_content_sections_bullet_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_content_sections_bullet_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    highlight_text character varying,
    description character varying
);


--
-- Name: blogs_content_sections_numbered_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_content_sections_numbered_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    highlight_text character varying,
    description character varying
);


--
-- Name: blogs_content_sections_paragraphs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_content_sections_paragraphs (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    text character varying
);


--
-- Name: blogs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blogs_id_seq OWNED BY public.blogs.id;


--
-- Name: blogs_page_hero; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_page_hero (
    id integer NOT NULL,
    heading character varying DEFAULT 'Knowledge Hub'::character varying NOT NULL,
    background_image_id integer,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: blogs_page_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blogs_page_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blogs_page_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blogs_page_hero_id_seq OWNED BY public.blogs_page_hero.id;


--
-- Name: career_find_place; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_find_place (
    id integer NOT NULL,
    image_id integer NOT NULL,
    tagline character varying DEFAULT 'Grow with us. Build with us. Secure the future with us.'::character varying NOT NULL,
    title character varying DEFAULT 'Find Your Place at NCG'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: career_find_place_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_find_place_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_find_place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_find_place_id_seq OWNED BY public.career_find_place.id;


--
-- Name: career_find_place_paragraphs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_find_place_paragraphs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    text character varying NOT NULL
);


--
-- Name: career_hero; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_hero (
    id integer NOT NULL,
    background_image_id integer NOT NULL,
    title character varying DEFAULT 'Why Work with Us'::character varying NOT NULL,
    subtitle character varying DEFAULT 'At NCG, we believe that cybersecurity is about more than just systems—it''s about people.'::character varying NOT NULL,
    description character varying DEFAULT 'Join a team where your ideas matter, collaboration is encouraged, and professional growth is a priority.'::character varying NOT NULL,
    button_text character varying DEFAULT 'View Job Openings'::character varying NOT NULL,
    button_link character varying DEFAULT '#job-openings'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: career_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_hero_id_seq OWNED BY public.career_hero.id;


--
-- Name: career_job_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_job_section (
    id integer NOT NULL,
    heading character varying DEFAULT 'Check out our job openings'::character varying NOT NULL,
    button_text character varying DEFAULT 'View All'::character varying NOT NULL,
    button_link character varying DEFAULT '/career'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: career_job_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_job_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_job_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_job_section_id_seq OWNED BY public.career_job_section.id;


--
-- Name: career_job_section_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_job_section_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    job_openings_id integer
);


--
-- Name: career_job_section_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_job_section_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_job_section_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_job_section_rels_id_seq OWNED BY public.career_job_section_rels.id;


--
-- Name: career_life_at_ncg; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_life_at_ncg (
    id integer NOT NULL,
    title character varying DEFAULT 'Life at NCG'::character varying,
    subtitle character varying DEFAULT 'Real Stories, Real People'::character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: career_life_at_ncg_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_life_at_ncg_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_life_at_ncg_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_life_at_ncg_id_seq OWNED BY public.career_life_at_ncg.id;


--
-- Name: career_life_at_ncg_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_life_at_ncg_images (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer NOT NULL
);


--
-- Name: career_spotify; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_spotify (
    id integer NOT NULL,
    icon_id integer,
    title character varying DEFAULT 'Discover the NCG Soundtrack'::character varying NOT NULL,
    description character varying DEFAULT 'We''re more than cybersecurity—explore our culture through music. Listen to our very own track on Spotify and get a feel for the spirit that drives us forward.'::character varying NOT NULL,
    button_text character varying DEFAULT 'Listen on Spotify'::character varying NOT NULL,
    spotify_link character varying DEFAULT 'https://spotify.com'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: career_spotify_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_spotify_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_spotify_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_spotify_id_seq OWNED BY public.career_spotify.id;


--
-- Name: career_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_stats (
    id integer NOT NULL,
    title character varying DEFAULT 'Things we are proud of:'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: career_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_stats_id_seq OWNED BY public.career_stats.id;


--
-- Name: career_stats_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_stats_stats (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    value character varying NOT NULL,
    label character varying NOT NULL
);


--
-- Name: career_testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_testimonials (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: career_testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_testimonials_id_seq OWNED BY public.career_testimonials.id;


--
-- Name: career_testimonials_testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_testimonials_testimonials (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer NOT NULL,
    name character varying NOT NULL,
    role character varying NOT NULL,
    quote character varying NOT NULL
);


--
-- Name: career_work_here; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_work_here (
    id integer NOT NULL,
    title character varying DEFAULT 'What It''s Like to Work Here'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: career_work_here_cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_work_here_cards (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    number character varying NOT NULL,
    description character varying NOT NULL,
    image_id integer NOT NULL
);


--
-- Name: career_work_here_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_work_here_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_work_here_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_work_here_id_seq OWNED BY public.career_work_here.id;


--
-- Name: case_studies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying,
    image_id integer,
    category character varying NOT NULL,
    icon_type public.enum_case_studies_icon_type,
    icon_id integer,
    description character varying NOT NULL,
    link character varying,
    hero_background_image_id integer,
    hero_logo_id integer,
    intro_description character varying,
    client_overview_client_name character varying,
    client_overview_industry character varying,
    client_overview_location character varying,
    client_overview_size character varying,
    challenges_title character varying DEFAULT 'Challenges Faced By Client'::character varying,
    challenges_description character varying,
    how_n_c_g_helped_title character varying DEFAULT 'How NCG Helped'::character varying,
    how_n_c_g_helped_subtitle character varying,
    solutions_implemented_title character varying DEFAULT 'Solutions Implemented By NCG'::character varying,
    solutions_implemented_description character varying,
    solutions_implemented_icon_image_id integer,
    value_delivered_title character varying DEFAULT 'Value Delivered'::character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: case_studies_challenges_challenge_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies_challenges_challenge_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    challenge character varying NOT NULL
);


--
-- Name: case_studies_grid; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies_grid (
    id integer NOT NULL,
    button_text character varying DEFAULT 'All Case Studies'::character varying NOT NULL,
    button_link character varying DEFAULT '/case-studies'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: case_studies_grid_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.case_studies_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: case_studies_grid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.case_studies_grid_id_seq OWNED BY public.case_studies_grid.id;


--
-- Name: case_studies_grid_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies_grid_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    case_studies_id integer
);


--
-- Name: case_studies_grid_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.case_studies_grid_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: case_studies_grid_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.case_studies_grid_rels_id_seq OWNED BY public.case_studies_grid_rels.id;


--
-- Name: case_studies_hero; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies_hero (
    id integer NOT NULL,
    overline character varying DEFAULT 'case studies'::character varying NOT NULL,
    heading character varying DEFAULT 'Real Results.
Proven Security.'::character varying NOT NULL,
    background_image_id integer,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: case_studies_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.case_studies_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: case_studies_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.case_studies_hero_id_seq OWNED BY public.case_studies_hero.id;


--
-- Name: case_studies_how_n_c_g_helped_solutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies_how_n_c_g_helped_solutions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer,
    title character varying NOT NULL,
    description character varying NOT NULL
);


--
-- Name: case_studies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.case_studies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: case_studies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.case_studies_id_seq OWNED BY public.case_studies.id;


--
-- Name: case_studies_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies_page (
    id integer NOT NULL,
    hero_overline character varying DEFAULT 'case studies'::character varying NOT NULL,
    hero_heading character varying DEFAULT 'Real Results.
Proven Security.'::character varying NOT NULL,
    hero_background_image_id integer,
    hero_intro_text character varying DEFAULT 'At NCG, we pride ourselves on delivering tailored, high-impact cybersecurity solutions. These case studies showcase how we''ve addressed complex challenges and delivered measurable value to industry leaders.'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: case_studies_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.case_studies_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: case_studies_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.case_studies_page_id_seq OWNED BY public.case_studies_page.id;


--
-- Name: case_studies_page_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies_page_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    case_studies_id integer
);


--
-- Name: case_studies_page_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.case_studies_page_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: case_studies_page_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.case_studies_page_rels_id_seq OWNED BY public.case_studies_page_rels.id;


--
-- Name: case_studies_solution_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies_solution_tags (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    tag character varying NOT NULL
);


--
-- Name: case_studies_solutions_implemented_solution_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies_solutions_implemented_solution_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    solution character varying NOT NULL
);


--
-- Name: case_studies_value_delivered_value_cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies_value_delivered_value_cards (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    number character varying,
    image_id integer,
    title character varying NOT NULL,
    description character varying NOT NULL
);


--
-- Name: contact_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_section (
    id integer NOT NULL,
    heading character varying DEFAULT 'Partner with NCG for cybersecurity excellence'::character varying NOT NULL,
    team_member_name character varying NOT NULL,
    team_member_position character varying NOT NULL,
    team_member_image_id integer,
    team_member_linkedin_url character varying,
    submit_button_text character varying DEFAULT 'Connect Today'::character varying NOT NULL,
    privacy_text character varying DEFAULT 'By clicking submit, you acknowledge our Privacy Policy and agree to receive email communication from us.'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: contact_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_section_id_seq OWNED BY public.contact_section.id;


--
-- Name: contact_section_team_member_certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_section_team_member_certifications (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL
);


--
-- Name: footer_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.footer_section (
    id integer NOT NULL,
    contact_us_phone_heading character varying DEFAULT 'Phone:'::character varying NOT NULL,
    contact_us_phone_sweden character varying DEFAULT 'Sweden: +46-732-442-583'::character varying NOT NULL,
    contact_us_phone_denmark character varying DEFAULT 'Denmark: +12 34 45 67 80'::character varying NOT NULL,
    contact_us_email_heading character varying DEFAULT 'Email:'::character varying NOT NULL,
    contact_us_email character varying DEFAULT 'info@ncgrp.se'::character varying NOT NULL,
    follow_us_title character varying DEFAULT 'Follow Us'::character varying NOT NULL,
    bottom_bar_copyright_text character varying DEFAULT '© 2025 Nordic Cyber Group'::character varying NOT NULL,
    bottom_bar_privacy_label character varying DEFAULT 'Privacy Policy'::character varying NOT NULL,
    bottom_bar_privacy_href character varying DEFAULT '/privacy'::character varying NOT NULL,
    sweden_title character varying DEFAULT 'Sweden'::character varying NOT NULL,
    sweden_office_heading character varying DEFAULT 'Head Office Stockholm'::character varying NOT NULL,
    sweden_address_line1 character varying DEFAULT 'Kungsbro Strand 29, 112 26'::character varying NOT NULL,
    sweden_address_line2 character varying DEFAULT 'Stockholm, Sweden'::character varying NOT NULL,
    malmo_title character varying DEFAULT 'Malmo'::character varying NOT NULL,
    malmo_office_heading character varying DEFAULT 'Branch Office'::character varying NOT NULL,
    malmo_address_line1 character varying DEFAULT 'Torggatan 4, Seventh Floor'::character varying NOT NULL,
    malmo_address_line2 character varying DEFAULT '211 40 Malmo'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: footer_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.footer_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: footer_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.footer_section_id_seq OWNED BY public.footer_section.id;


--
-- Name: hero_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hero_section (
    id integer NOT NULL,
    main_heading character varying NOT NULL,
    background_image_id integer,
    call_to_action_description character varying NOT NULL,
    call_to_action_cta_heading character varying NOT NULL,
    call_to_action_cta_link character varying DEFAULT '/contact'::character varying NOT NULL,
    call_to_action_background_color character varying DEFAULT '#001D5C'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: hero_section_animated_texts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hero_section_animated_texts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    text character varying NOT NULL
);


--
-- Name: hero_section_background_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hero_section_background_images (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer NOT NULL
);


--
-- Name: hero_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hero_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hero_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hero_section_id_seq OWNED BY public.hero_section.id;


--
-- Name: icons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.icons (
    id integer NOT NULL,
    name character varying NOT NULL,
    svg_id integer NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: icons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.icons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: icons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.icons_id_seq OWNED BY public.icons.id;


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_applications (
    id integer NOT NULL,
    job_opening_id integer NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying,
    location character varying NOT NULL,
    security_check_consent public.enum_job_applications_security_check_consent DEFAULT 'no'::public.enum_job_applications_security_check_consent NOT NULL,
    years_of_experience character varying NOT NULL,
    swedish_tech_industry public.enum_job_applications_swedish_tech_industry DEFAULT 'no'::public.enum_job_applications_swedish_tech_industry NOT NULL,
    strategic_plans_experience public.enum_job_applications_strategic_plans_experience DEFAULT 'no'::public.enum_job_applications_strategic_plans_experience NOT NULL,
    resume_id integer NOT NULL,
    cover_letter character varying,
    privacy_policy_consent boolean DEFAULT false NOT NULL,
    future_opportunities_consent boolean DEFAULT false,
    linkedin_url character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: job_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.job_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.job_applications_id_seq OWNED BY public.job_applications.id;


--
-- Name: job_applications_language_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_applications_language_skills (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_job_applications_language_skills,
    id integer NOT NULL
);


--
-- Name: job_applications_language_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.job_applications_language_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_applications_language_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.job_applications_language_skills_id_seq OWNED BY public.job_applications_language_skills.id;


--
-- Name: job_applications_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_applications_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    media_id integer
);


--
-- Name: job_applications_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.job_applications_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_applications_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.job_applications_rels_id_seq OWNED BY public.job_applications_rels.id;


--
-- Name: job_openings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_openings (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying,
    location character varying NOT NULL,
    type public.enum_job_openings_type NOT NULL,
    apply_by_date timestamp(3) with time zone NOT NULL,
    description character varying NOT NULL,
    hero_image_id integer,
    image_id integer NOT NULL,
    role_description jsonb,
    company_introduction character varying,
    how_to_apply character varying,
    department character varying,
    remote_status public.enum_job_openings_remote_status,
    link character varying,
    featured boolean DEFAULT true,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: job_openings_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_openings_attributes (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    attribute character varying NOT NULL
);


--
-- Name: job_openings_benefits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_openings_benefits (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    benefit character varying NOT NULL
);


--
-- Name: job_openings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.job_openings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_openings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.job_openings_id_seq OWNED BY public.job_openings.id;


--
-- Name: job_openings_required_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_openings_required_skills (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    skill character varying NOT NULL
);


--
-- Name: job_openings_responsibilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_openings_responsibilities (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    responsibility character varying NOT NULL
);


--
-- Name: jobs_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs_section (
    id integer NOT NULL,
    background_image_id integer NOT NULL,
    heading character varying DEFAULT 'All Job Openings'::character varying NOT NULL,
    description character varying DEFAULT 'Explore exciting opportunities at NCG and become part of a team dedicated to building resilience, protecting data, and shaping the future of cybersecurity.'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: jobs_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_section_id_seq OWNED BY public.jobs_section.id;


--
-- Name: jobs_section_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs_section_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    job_openings_id integer
);


--
-- Name: jobs_section_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_section_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_section_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_section_rels_id_seq OWNED BY public.jobs_section_rels.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric
);


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    case_studies_id integer,
    blogs_id integer,
    icons_id integer,
    job_openings_id integer,
    job_applications_id integer,
    services_id integer,
    sub_services_id integer
);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: privacy_policy_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.privacy_policy_section (
    id integer NOT NULL,
    hero_background_image_id integer NOT NULL,
    hero_title character varying DEFAULT 'Privacy Policy'::character varying NOT NULL,
    hero_effective_date character varying DEFAULT '25 August 2025'::character varying NOT NULL,
    introduction character varying DEFAULT 'Nordic Cyber Group (NCG) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and protect your information, and outlines your rights under applicable data protection laws, including the General Data Protection Regulation (GDPR).'::character varying NOT NULL,
    cookies_policy_introduction character varying DEFAULT 'Cookies are small text files that are stored on your device when you visit our website. They help us improve functionality, analyze performance, and enhance your user experience.'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: privacy_policy_section_cookies_policy_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.privacy_policy_section_cookies_policy_sections (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL,
    content character varying NOT NULL
);


--
-- Name: privacy_policy_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.privacy_policy_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: privacy_policy_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.privacy_policy_section_id_seq OWNED BY public.privacy_policy_section.id;


--
-- Name: privacy_policy_section_privacy_policy_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.privacy_policy_section_privacy_policy_sections (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL,
    content character varying NOT NULL
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    slug character varying,
    title character varying NOT NULL,
    description character varying NOT NULL,
    hero_image_id integer,
    hero_alt character varying,
    hero_tagline character varying,
    hero_title character varying,
    hero_subtitle character varying,
    sub_service_title character varying,
    sub_service_description character varying,
    cta_title character varying,
    cta_description character varying,
    advantages_title character varying,
    advantages_description character varying,
    case_studies_label character varying,
    case_studies_hero_title character varying,
    case_studies_intro character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: services_advantages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_advantages (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    image_id integer
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: services_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    case_studies_id integer,
    sub_services_id integer
);


--
-- Name: services_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_rels_id_seq OWNED BY public.services_rels.id;


--
-- Name: services_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_section (
    id integer NOT NULL,
    section_title character varying DEFAULT 'Our
Services'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: services_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_section_id_seq OWNED BY public.services_section.id;


--
-- Name: services_section_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_section_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    sub_services_id integer
);


--
-- Name: services_section_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_section_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_section_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_section_rels_id_seq OWNED BY public.services_section_rels.id;


--
-- Name: services_section_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_section_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    service_id integer NOT NULL
);


--
-- Name: sub_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sub_services (
    id integer NOT NULL,
    slug character varying NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    "order" numeric,
    hero_image_id integer,
    hero_title character varying,
    hero_subtitle character varying,
    importance_title character varying,
    importance_description character varying,
    importance_image_id integer,
    download_banner_title character varying,
    download_banner_description character varying,
    download_banner_button_text character varying,
    download_banner_button_link character varying,
    download_banner_image_id integer,
    challenges_title character varying,
    challenges_description character varying,
    challenges_button_text character varying,
    challenges_button_link character varying,
    benefits_title character varying,
    benefits_description character varying,
    benefits_conclusion character varying,
    benefits_button_text character varying,
    benefits_button_link character varying,
    core_features_title character varying,
    core_features_description character varying,
    core_features_image_id integer,
    iga_services_title character varying,
    iga_services_description character varying,
    success_stories_title character varying,
    success_stories_description character varying,
    success_stories_cta_text character varying,
    success_stories_cta_link character varying,
    success_stories_background_image_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: sub_services_advantages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sub_services_advantages (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    image_id integer
);


--
-- Name: sub_services_challenges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sub_services_challenges (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    number character varying,
    title character varying NOT NULL,
    description character varying NOT NULL,
    image_id integer
);


--
-- Name: sub_services_core_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sub_services_core_features (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL
);


--
-- Name: sub_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sub_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sub_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sub_services_id_seq OWNED BY public.sub_services.id;


--
-- Name: sub_services_iga_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sub_services_iga_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    number character varying,
    title character varying NOT NULL,
    description character varying NOT NULL,
    background_image_id integer
);


--
-- Name: sub_services_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sub_services_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer
);


--
-- Name: sub_services_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sub_services_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sub_services_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sub_services_rels_id_seq OWNED BY public.sub_services_rels.id;


--
-- Name: testimonials_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials_section (
    id integer NOT NULL,
    overline character varying DEFAULT 'client testimonials'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: testimonials_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.testimonials_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: testimonials_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.testimonials_section_id_seq OWNED BY public.testimonials_section.id;


--
-- Name: testimonials_section_testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials_section_testimonials (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    "position" character varying NOT NULL,
    company character varying NOT NULL,
    image_id integer,
    quote character varying NOT NULL
);


--
-- Name: trusted_by_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trusted_by_section (
    id integer NOT NULL,
    overline character varying DEFAULT 'our clients'::character varying NOT NULL,
    heading character varying DEFAULT 'Trusted by Industry Leaders'::character varying NOT NULL,
    description character varying DEFAULT 'Helping banks, fintechs, governments, and global enterprises stay secure'::character varying NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: trusted_by_section_clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trusted_by_section_clients (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    logo_id integer NOT NULL
);


--
-- Name: trusted_by_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trusted_by_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trusted_by_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trusted_by_section_id_seq OWNED BY public.trusted_by_section.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


--
-- Name: about_core_values_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_core_values_section ALTER COLUMN id SET DEFAULT nextval('public.about_core_values_section_id_seq'::regclass);


--
-- Name: about_cta_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_cta_section ALTER COLUMN id SET DEFAULT nextval('public.about_cta_section_id_seq'::regclass);


--
-- Name: about_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_hero ALTER COLUMN id SET DEFAULT nextval('public.about_hero_id_seq'::regclass);


--
-- Name: about_mission_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_mission_section ALTER COLUMN id SET DEFAULT nextval('public.about_mission_section_id_seq'::regclass);


--
-- Name: about_stats_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_stats_section ALTER COLUMN id SET DEFAULT nextval('public.about_stats_section_id_seq'::regclass);


--
-- Name: about_team_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_team_section ALTER COLUMN id SET DEFAULT nextval('public.about_team_section_id_seq'::regclass);


--
-- Name: about_us_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_us_section ALTER COLUMN id SET DEFAULT nextval('public.about_us_section_id_seq'::regclass);


--
-- Name: approach_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.approach_section ALTER COLUMN id SET DEFAULT nextval('public.approach_section_id_seq'::regclass);


--
-- Name: blogs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs ALTER COLUMN id SET DEFAULT nextval('public.blogs_id_seq'::regclass);


--
-- Name: blogs_page_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_page_hero ALTER COLUMN id SET DEFAULT nextval('public.blogs_page_hero_id_seq'::regclass);


--
-- Name: career_find_place id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_find_place ALTER COLUMN id SET DEFAULT nextval('public.career_find_place_id_seq'::regclass);


--
-- Name: career_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_hero ALTER COLUMN id SET DEFAULT nextval('public.career_hero_id_seq'::regclass);


--
-- Name: career_job_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_job_section ALTER COLUMN id SET DEFAULT nextval('public.career_job_section_id_seq'::regclass);


--
-- Name: career_job_section_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_job_section_rels ALTER COLUMN id SET DEFAULT nextval('public.career_job_section_rels_id_seq'::regclass);


--
-- Name: career_life_at_ncg id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_life_at_ncg ALTER COLUMN id SET DEFAULT nextval('public.career_life_at_ncg_id_seq'::regclass);


--
-- Name: career_spotify id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_spotify ALTER COLUMN id SET DEFAULT nextval('public.career_spotify_id_seq'::regclass);


--
-- Name: career_stats id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_stats ALTER COLUMN id SET DEFAULT nextval('public.career_stats_id_seq'::regclass);


--
-- Name: career_testimonials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_testimonials ALTER COLUMN id SET DEFAULT nextval('public.career_testimonials_id_seq'::regclass);


--
-- Name: career_work_here id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_work_here ALTER COLUMN id SET DEFAULT nextval('public.career_work_here_id_seq'::regclass);


--
-- Name: case_studies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies ALTER COLUMN id SET DEFAULT nextval('public.case_studies_id_seq'::regclass);


--
-- Name: case_studies_grid id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_grid ALTER COLUMN id SET DEFAULT nextval('public.case_studies_grid_id_seq'::regclass);


--
-- Name: case_studies_grid_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_grid_rels ALTER COLUMN id SET DEFAULT nextval('public.case_studies_grid_rels_id_seq'::regclass);


--
-- Name: case_studies_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_hero ALTER COLUMN id SET DEFAULT nextval('public.case_studies_hero_id_seq'::regclass);


--
-- Name: case_studies_page id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_page ALTER COLUMN id SET DEFAULT nextval('public.case_studies_page_id_seq'::regclass);


--
-- Name: case_studies_page_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_page_rels ALTER COLUMN id SET DEFAULT nextval('public.case_studies_page_rels_id_seq'::regclass);


--
-- Name: contact_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_section ALTER COLUMN id SET DEFAULT nextval('public.contact_section_id_seq'::regclass);


--
-- Name: footer_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_section ALTER COLUMN id SET DEFAULT nextval('public.footer_section_id_seq'::regclass);


--
-- Name: hero_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_section ALTER COLUMN id SET DEFAULT nextval('public.hero_section_id_seq'::regclass);


--
-- Name: icons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.icons ALTER COLUMN id SET DEFAULT nextval('public.icons_id_seq'::regclass);


--
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- Name: job_applications_language_skills id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications_language_skills ALTER COLUMN id SET DEFAULT nextval('public.job_applications_language_skills_id_seq'::regclass);


--
-- Name: job_applications_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications_rels ALTER COLUMN id SET DEFAULT nextval('public.job_applications_rels_id_seq'::regclass);


--
-- Name: job_openings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings ALTER COLUMN id SET DEFAULT nextval('public.job_openings_id_seq'::regclass);


--
-- Name: jobs_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_section ALTER COLUMN id SET DEFAULT nextval('public.jobs_section_id_seq'::regclass);


--
-- Name: jobs_section_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_section_rels ALTER COLUMN id SET DEFAULT nextval('public.jobs_section_rels_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: privacy_policy_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.privacy_policy_section ALTER COLUMN id SET DEFAULT nextval('public.privacy_policy_section_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: services_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_rels ALTER COLUMN id SET DEFAULT nextval('public.services_rels_id_seq'::regclass);


--
-- Name: services_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_section ALTER COLUMN id SET DEFAULT nextval('public.services_section_id_seq'::regclass);


--
-- Name: services_section_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_section_rels ALTER COLUMN id SET DEFAULT nextval('public.services_section_rels_id_seq'::regclass);


--
-- Name: sub_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services ALTER COLUMN id SET DEFAULT nextval('public.sub_services_id_seq'::regclass);


--
-- Name: sub_services_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_rels ALTER COLUMN id SET DEFAULT nextval('public.sub_services_rels_id_seq'::regclass);


--
-- Name: testimonials_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials_section ALTER COLUMN id SET DEFAULT nextval('public.testimonials_section_id_seq'::regclass);


--
-- Name: trusted_by_section id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trusted_by_section ALTER COLUMN id SET DEFAULT nextval('public.trusted_by_section_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: about_core_values_section; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_core_values_section (id, title, subtitle, updated_at, created_at) FROM stdin;
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
-- Data for Name: icons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.icons (id, name, svg_id, updated_at, created_at) FROM stdin;
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
-- Data for Name: job_openings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_openings (id, title, slug, location, type, apply_by_date, description, hero_image_id, image_id, role_description, company_introduction, how_to_apply, department, remote_status, link, featured, updated_at, created_at) FROM stdin;
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
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media (id, alt, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents (id, global_slug, updated_at, created_at) FROM stdin;
1	hero-section	2025-12-09 22:25:52.923+05:30	2025-12-09 22:25:52.923+05:30
\.


--
-- Data for Name: payload_locked_documents_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents_rels (id, "order", parent_id, path, users_id, media_id, case_studies_id, blogs_id, icons_id, job_openings_id, job_applications_id, services_id, sub_services_id) FROM stdin;
1	\N	1	user	1	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: payload_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_migrations (id, name, batch, updated_at, created_at) FROM stdin;
1	20251026_222335	1	2025-12-09 14:08:25.788+05:30	2025-12-09 14:08:25.787+05:30
2	dev	-1	2025-12-09 22:24:59.228+05:30	2025-12-09 14:15:30.056+05:30
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
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, slug, title, description, hero_image_id, hero_alt, hero_tagline, hero_title, hero_subtitle, sub_service_title, sub_service_description, cta_title, cta_description, advantages_title, advantages_description, case_studies_label, case_studies_hero_title, case_studies_intro, updated_at, created_at) FROM stdin;
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
-- Data for Name: sub_services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sub_services (id, slug, title, description, "order", hero_image_id, hero_title, hero_subtitle, importance_title, importance_description, importance_image_id, download_banner_title, download_banner_description, download_banner_button_text, download_banner_button_link, download_banner_image_id, challenges_title, challenges_description, challenges_button_text, challenges_button_link, benefits_title, benefits_description, benefits_conclusion, benefits_button_text, benefits_button_link, core_features_title, core_features_description, core_features_image_id, iga_services_title, iga_services_description, success_stories_title, success_stories_description, success_stories_cta_text, success_stories_cta_link, success_stories_background_image_id, updated_at, created_at) FROM stdin;
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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until) FROM stdin;
1	2025-12-09 14:13:20.746+05:30	2025-12-09 14:13:20.746+05:30	admin@ncg.com	\N	\N	39646cdf727432553c79cc499471c4a5b9afa3bb1c3051ed84c3b082deeaabe3	e1b02368c4163304107f02523fa4cfb5607185f201d06b2e312cd969f30ea8f74c46b85bb69106f5e779fa505648883ff45d370d9a81fb37d54d4c494d45e1d2238728d98b54c37fcae254a280f9917efe99b1f2e125bbfc83589acb55d271cf0fe3c8dcdb803007efb8acc0aa78b5314eb9e5916afc2e1a9d8643a931c715f70363f066c0f864c47491b62fcd5a15cfc2c63739926b311b4357fe4bfafa3c8d3d8be82ac39cb2080f2cafde2a166ded9fbdabbaf908bde310450c96e3322d2b5053fc084a85533bc8a29fe65d24eed16566681731bb520e890cb1be2255751ac779aa307f49df718cdb69d6d6b345802f5db46ff3e3665ded1399631b3d84f341eac830eff52edb35f5a9716f658efd7ac23b3e47222826b16545a9cfb3514c3bcb64b7efd73539f43b6c292c31eaad590754c01fb37b47a0815e94ea0cf9037c03585438ffe0c77a8f826ed56cca7e0f1bc0e6368607c3c5d77fc9e6745ef800a94e267174c007fa97ee21a86c915735ee413b9d5e75534a8b73289d382fc0153ed59ec35542b6fbcf9c670beabf7f3beaa0c1805c0cd478b713025fbedd6ab8fb48e2f3e170d9cd5d9d6687277b89466dda313c8e06a3ac2ec81e2ec01f989ccc2c858949be1f3d9982449be7e23585bd0d8ad5d02249205238a5979a325234aac78a95db3e14208ad65c05de4b5fb8244ccdbffe21dbb103cac8b2e127d0	0	\N
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
-- Name: about_core_values_section about_core_values_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_core_values_section
    ADD CONSTRAINT about_core_values_section_pkey PRIMARY KEY (id);


--
-- Name: about_core_values_section_values about_core_values_section_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_core_values_section_values
    ADD CONSTRAINT about_core_values_section_values_pkey PRIMARY KEY (id);


--
-- Name: about_cta_section about_cta_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_cta_section
    ADD CONSTRAINT about_cta_section_pkey PRIMARY KEY (id);


--
-- Name: about_hero about_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_hero
    ADD CONSTRAINT about_hero_pkey PRIMARY KEY (id);


--
-- Name: about_mission_section about_mission_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_mission_section
    ADD CONSTRAINT about_mission_section_pkey PRIMARY KEY (id);


--
-- Name: about_stats_section about_stats_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_stats_section
    ADD CONSTRAINT about_stats_section_pkey PRIMARY KEY (id);


--
-- Name: about_stats_section_stats about_stats_section_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_stats_section_stats
    ADD CONSTRAINT about_stats_section_stats_pkey PRIMARY KEY (id);


--
-- Name: about_team_section_members about_team_section_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_team_section_members
    ADD CONSTRAINT about_team_section_members_pkey PRIMARY KEY (id);


--
-- Name: about_team_section about_team_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_team_section
    ADD CONSTRAINT about_team_section_pkey PRIMARY KEY (id);


--
-- Name: about_us_section_paragraphs about_us_section_paragraphs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_us_section_paragraphs
    ADD CONSTRAINT about_us_section_paragraphs_pkey PRIMARY KEY (id);


--
-- Name: about_us_section about_us_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_us_section
    ADD CONSTRAINT about_us_section_pkey PRIMARY KEY (id);


--
-- Name: approach_section approach_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.approach_section
    ADD CONSTRAINT approach_section_pkey PRIMARY KEY (id);


--
-- Name: approach_section_steps approach_section_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.approach_section_steps
    ADD CONSTRAINT approach_section_steps_pkey PRIMARY KEY (id);


--
-- Name: blogs_content_sections_bullet_items blogs_content_sections_bullet_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_content_sections_bullet_items
    ADD CONSTRAINT blogs_content_sections_bullet_items_pkey PRIMARY KEY (id);


--
-- Name: blogs_content_sections_numbered_items blogs_content_sections_numbered_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_content_sections_numbered_items
    ADD CONSTRAINT blogs_content_sections_numbered_items_pkey PRIMARY KEY (id);


--
-- Name: blogs_content_sections_paragraphs blogs_content_sections_paragraphs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_content_sections_paragraphs
    ADD CONSTRAINT blogs_content_sections_paragraphs_pkey PRIMARY KEY (id);


--
-- Name: blogs_content_sections blogs_content_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_content_sections
    ADD CONSTRAINT blogs_content_sections_pkey PRIMARY KEY (id);


--
-- Name: blogs_page_hero blogs_page_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_page_hero
    ADD CONSTRAINT blogs_page_hero_pkey PRIMARY KEY (id);


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- Name: career_find_place_paragraphs career_find_place_paragraphs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_find_place_paragraphs
    ADD CONSTRAINT career_find_place_paragraphs_pkey PRIMARY KEY (id);


--
-- Name: career_find_place career_find_place_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_find_place
    ADD CONSTRAINT career_find_place_pkey PRIMARY KEY (id);


--
-- Name: career_hero career_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_hero
    ADD CONSTRAINT career_hero_pkey PRIMARY KEY (id);


--
-- Name: career_job_section career_job_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_job_section
    ADD CONSTRAINT career_job_section_pkey PRIMARY KEY (id);


--
-- Name: career_job_section_rels career_job_section_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_job_section_rels
    ADD CONSTRAINT career_job_section_rels_pkey PRIMARY KEY (id);


--
-- Name: career_life_at_ncg_images career_life_at_ncg_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_life_at_ncg_images
    ADD CONSTRAINT career_life_at_ncg_images_pkey PRIMARY KEY (id);


--
-- Name: career_life_at_ncg career_life_at_ncg_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_life_at_ncg
    ADD CONSTRAINT career_life_at_ncg_pkey PRIMARY KEY (id);


--
-- Name: career_spotify career_spotify_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_spotify
    ADD CONSTRAINT career_spotify_pkey PRIMARY KEY (id);


--
-- Name: career_stats career_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_stats
    ADD CONSTRAINT career_stats_pkey PRIMARY KEY (id);


--
-- Name: career_stats_stats career_stats_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_stats_stats
    ADD CONSTRAINT career_stats_stats_pkey PRIMARY KEY (id);


--
-- Name: career_testimonials career_testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_testimonials
    ADD CONSTRAINT career_testimonials_pkey PRIMARY KEY (id);


--
-- Name: career_testimonials_testimonials career_testimonials_testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_testimonials_testimonials
    ADD CONSTRAINT career_testimonials_testimonials_pkey PRIMARY KEY (id);


--
-- Name: career_work_here_cards career_work_here_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_work_here_cards
    ADD CONSTRAINT career_work_here_cards_pkey PRIMARY KEY (id);


--
-- Name: career_work_here career_work_here_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_work_here
    ADD CONSTRAINT career_work_here_pkey PRIMARY KEY (id);


--
-- Name: case_studies_challenges_challenge_items case_studies_challenges_challenge_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_challenges_challenge_items
    ADD CONSTRAINT case_studies_challenges_challenge_items_pkey PRIMARY KEY (id);


--
-- Name: case_studies_grid case_studies_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_grid
    ADD CONSTRAINT case_studies_grid_pkey PRIMARY KEY (id);


--
-- Name: case_studies_grid_rels case_studies_grid_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_grid_rels
    ADD CONSTRAINT case_studies_grid_rels_pkey PRIMARY KEY (id);


--
-- Name: case_studies_hero case_studies_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_hero
    ADD CONSTRAINT case_studies_hero_pkey PRIMARY KEY (id);


--
-- Name: case_studies_how_n_c_g_helped_solutions case_studies_how_n_c_g_helped_solutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_how_n_c_g_helped_solutions
    ADD CONSTRAINT case_studies_how_n_c_g_helped_solutions_pkey PRIMARY KEY (id);


--
-- Name: case_studies_page case_studies_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_page
    ADD CONSTRAINT case_studies_page_pkey PRIMARY KEY (id);


--
-- Name: case_studies_page_rels case_studies_page_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_page_rels
    ADD CONSTRAINT case_studies_page_rels_pkey PRIMARY KEY (id);


--
-- Name: case_studies case_studies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT case_studies_pkey PRIMARY KEY (id);


--
-- Name: case_studies_solution_tags case_studies_solution_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_solution_tags
    ADD CONSTRAINT case_studies_solution_tags_pkey PRIMARY KEY (id);


--
-- Name: case_studies_solutions_implemented_solution_items case_studies_solutions_implemented_solution_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_solutions_implemented_solution_items
    ADD CONSTRAINT case_studies_solutions_implemented_solution_items_pkey PRIMARY KEY (id);


--
-- Name: case_studies_value_delivered_value_cards case_studies_value_delivered_value_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_value_delivered_value_cards
    ADD CONSTRAINT case_studies_value_delivered_value_cards_pkey PRIMARY KEY (id);


--
-- Name: contact_section contact_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_section
    ADD CONSTRAINT contact_section_pkey PRIMARY KEY (id);


--
-- Name: contact_section_team_member_certifications contact_section_team_member_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_section_team_member_certifications
    ADD CONSTRAINT contact_section_team_member_certifications_pkey PRIMARY KEY (id);


--
-- Name: footer_section footer_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_section
    ADD CONSTRAINT footer_section_pkey PRIMARY KEY (id);


--
-- Name: hero_section_animated_texts hero_section_animated_texts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_section_animated_texts
    ADD CONSTRAINT hero_section_animated_texts_pkey PRIMARY KEY (id);


--
-- Name: hero_section_background_images hero_section_background_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_section_background_images
    ADD CONSTRAINT hero_section_background_images_pkey PRIMARY KEY (id);


--
-- Name: hero_section hero_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_section
    ADD CONSTRAINT hero_section_pkey PRIMARY KEY (id);


--
-- Name: icons icons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.icons
    ADD CONSTRAINT icons_pkey PRIMARY KEY (id);


--
-- Name: job_applications_language_skills job_applications_language_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications_language_skills
    ADD CONSTRAINT job_applications_language_skills_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: job_applications_rels job_applications_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications_rels
    ADD CONSTRAINT job_applications_rels_pkey PRIMARY KEY (id);


--
-- Name: job_openings_attributes job_openings_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings_attributes
    ADD CONSTRAINT job_openings_attributes_pkey PRIMARY KEY (id);


--
-- Name: job_openings_benefits job_openings_benefits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings_benefits
    ADD CONSTRAINT job_openings_benefits_pkey PRIMARY KEY (id);


--
-- Name: job_openings job_openings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings
    ADD CONSTRAINT job_openings_pkey PRIMARY KEY (id);


--
-- Name: job_openings_required_skills job_openings_required_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings_required_skills
    ADD CONSTRAINT job_openings_required_skills_pkey PRIMARY KEY (id);


--
-- Name: job_openings_responsibilities job_openings_responsibilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings_responsibilities
    ADD CONSTRAINT job_openings_responsibilities_pkey PRIMARY KEY (id);


--
-- Name: jobs_section jobs_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_section
    ADD CONSTRAINT jobs_section_pkey PRIMARY KEY (id);


--
-- Name: jobs_section_rels jobs_section_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_section_rels
    ADD CONSTRAINT jobs_section_rels_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: privacy_policy_section_cookies_policy_sections privacy_policy_section_cookies_policy_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.privacy_policy_section_cookies_policy_sections
    ADD CONSTRAINT privacy_policy_section_cookies_policy_sections_pkey PRIMARY KEY (id);


--
-- Name: privacy_policy_section privacy_policy_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.privacy_policy_section
    ADD CONSTRAINT privacy_policy_section_pkey PRIMARY KEY (id);


--
-- Name: privacy_policy_section_privacy_policy_sections privacy_policy_section_privacy_policy_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.privacy_policy_section_privacy_policy_sections
    ADD CONSTRAINT privacy_policy_section_privacy_policy_sections_pkey PRIMARY KEY (id);


--
-- Name: services_advantages services_advantages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_advantages
    ADD CONSTRAINT services_advantages_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services_rels services_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_rels
    ADD CONSTRAINT services_rels_pkey PRIMARY KEY (id);


--
-- Name: services_section services_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_section
    ADD CONSTRAINT services_section_pkey PRIMARY KEY (id);


--
-- Name: services_section_rels services_section_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_section_rels
    ADD CONSTRAINT services_section_rels_pkey PRIMARY KEY (id);


--
-- Name: services_section_services services_section_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_section_services
    ADD CONSTRAINT services_section_services_pkey PRIMARY KEY (id);


--
-- Name: sub_services_advantages sub_services_advantages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_advantages
    ADD CONSTRAINT sub_services_advantages_pkey PRIMARY KEY (id);


--
-- Name: sub_services_challenges sub_services_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_challenges
    ADD CONSTRAINT sub_services_challenges_pkey PRIMARY KEY (id);


--
-- Name: sub_services_core_features sub_services_core_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_core_features
    ADD CONSTRAINT sub_services_core_features_pkey PRIMARY KEY (id);


--
-- Name: sub_services_iga_services sub_services_iga_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_iga_services
    ADD CONSTRAINT sub_services_iga_services_pkey PRIMARY KEY (id);


--
-- Name: sub_services sub_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services
    ADD CONSTRAINT sub_services_pkey PRIMARY KEY (id);


--
-- Name: sub_services_rels sub_services_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_rels
    ADD CONSTRAINT sub_services_rels_pkey PRIMARY KEY (id);


--
-- Name: testimonials_section testimonials_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials_section
    ADD CONSTRAINT testimonials_section_pkey PRIMARY KEY (id);


--
-- Name: testimonials_section_testimonials testimonials_section_testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials_section_testimonials
    ADD CONSTRAINT testimonials_section_testimonials_pkey PRIMARY KEY (id);


--
-- Name: trusted_by_section_clients trusted_by_section_clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trusted_by_section_clients
    ADD CONSTRAINT trusted_by_section_clients_pkey PRIMARY KEY (id);


--
-- Name: trusted_by_section trusted_by_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trusted_by_section
    ADD CONSTRAINT trusted_by_section_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: about_core_values_section_values_icon_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_core_values_section_values_icon_idx ON public.about_core_values_section_values USING btree (icon_id);


--
-- Name: about_core_values_section_values_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_core_values_section_values_order_idx ON public.about_core_values_section_values USING btree (_order);


--
-- Name: about_core_values_section_values_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_core_values_section_values_parent_id_idx ON public.about_core_values_section_values USING btree (_parent_id);


--
-- Name: about_cta_section_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_cta_section_background_image_idx ON public.about_cta_section USING btree (background_image_id);


--
-- Name: about_hero_background_video_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_hero_background_video_idx ON public.about_hero USING btree (background_video_id);


--
-- Name: about_stats_section_stats_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_stats_section_stats_order_idx ON public.about_stats_section_stats USING btree (_order);


--
-- Name: about_stats_section_stats_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_stats_section_stats_parent_id_idx ON public.about_stats_section_stats USING btree (_parent_id);


--
-- Name: about_team_section_members_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_team_section_members_image_idx ON public.about_team_section_members USING btree (image_id);


--
-- Name: about_team_section_members_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_team_section_members_order_idx ON public.about_team_section_members USING btree (_order);


--
-- Name: about_team_section_members_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_team_section_members_parent_id_idx ON public.about_team_section_members USING btree (_parent_id);


--
-- Name: about_us_section_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_us_section_image_idx ON public.about_us_section USING btree (image_id);


--
-- Name: about_us_section_paragraphs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_us_section_paragraphs_order_idx ON public.about_us_section_paragraphs USING btree (_order);


--
-- Name: about_us_section_paragraphs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX about_us_section_paragraphs_parent_id_idx ON public.about_us_section_paragraphs USING btree (_parent_id);


--
-- Name: approach_section_steps_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX approach_section_steps_image_idx ON public.approach_section_steps USING btree (image_id);


--
-- Name: approach_section_steps_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX approach_section_steps_order_idx ON public.approach_section_steps USING btree (_order);


--
-- Name: approach_section_steps_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX approach_section_steps_parent_id_idx ON public.approach_section_steps USING btree (_parent_id);


--
-- Name: blogs_content_sections_bullet_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_content_sections_bullet_items_order_idx ON public.blogs_content_sections_bullet_items USING btree (_order);


--
-- Name: blogs_content_sections_bullet_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_content_sections_bullet_items_parent_id_idx ON public.blogs_content_sections_bullet_items USING btree (_parent_id);


--
-- Name: blogs_content_sections_numbered_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_content_sections_numbered_items_order_idx ON public.blogs_content_sections_numbered_items USING btree (_order);


--
-- Name: blogs_content_sections_numbered_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_content_sections_numbered_items_parent_id_idx ON public.blogs_content_sections_numbered_items USING btree (_parent_id);


--
-- Name: blogs_content_sections_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_content_sections_order_idx ON public.blogs_content_sections USING btree (_order);


--
-- Name: blogs_content_sections_paragraphs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_content_sections_paragraphs_order_idx ON public.blogs_content_sections_paragraphs USING btree (_order);


--
-- Name: blogs_content_sections_paragraphs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_content_sections_paragraphs_parent_id_idx ON public.blogs_content_sections_paragraphs USING btree (_parent_id);


--
-- Name: blogs_content_sections_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_content_sections_parent_id_idx ON public.blogs_content_sections USING btree (_parent_id);


--
-- Name: blogs_content_sections_section_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_content_sections_section_image_idx ON public.blogs_content_sections USING btree (section_image_id);


--
-- Name: blogs_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_created_at_idx ON public.blogs USING btree (created_at);


--
-- Name: blogs_hero_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_hero_background_image_idx ON public.blogs USING btree (hero_background_image_id);


--
-- Name: blogs_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_image_idx ON public.blogs USING btree (image_id);


--
-- Name: blogs_page_hero_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_page_hero_background_image_idx ON public.blogs_page_hero USING btree (background_image_id);


--
-- Name: blogs_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX blogs_slug_idx ON public.blogs USING btree (slug);


--
-- Name: blogs_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_updated_at_idx ON public.blogs USING btree (updated_at);


--
-- Name: career_find_place_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_find_place_image_idx ON public.career_find_place USING btree (image_id);


--
-- Name: career_find_place_paragraphs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_find_place_paragraphs_order_idx ON public.career_find_place_paragraphs USING btree (_order);


--
-- Name: career_find_place_paragraphs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_find_place_paragraphs_parent_id_idx ON public.career_find_place_paragraphs USING btree (_parent_id);


--
-- Name: career_hero_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_hero_background_image_idx ON public.career_hero USING btree (background_image_id);


--
-- Name: career_job_section_rels_job_openings_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_job_section_rels_job_openings_id_idx ON public.career_job_section_rels USING btree (job_openings_id);


--
-- Name: career_job_section_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_job_section_rels_order_idx ON public.career_job_section_rels USING btree ("order");


--
-- Name: career_job_section_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_job_section_rels_parent_idx ON public.career_job_section_rels USING btree (parent_id);


--
-- Name: career_job_section_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_job_section_rels_path_idx ON public.career_job_section_rels USING btree (path);


--
-- Name: career_life_at_ncg_images_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_life_at_ncg_images_image_idx ON public.career_life_at_ncg_images USING btree (image_id);


--
-- Name: career_life_at_ncg_images_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_life_at_ncg_images_order_idx ON public.career_life_at_ncg_images USING btree (_order);


--
-- Name: career_life_at_ncg_images_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_life_at_ncg_images_parent_id_idx ON public.career_life_at_ncg_images USING btree (_parent_id);


--
-- Name: career_spotify_icon_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_spotify_icon_idx ON public.career_spotify USING btree (icon_id);


--
-- Name: career_stats_stats_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_stats_stats_order_idx ON public.career_stats_stats USING btree (_order);


--
-- Name: career_stats_stats_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_stats_stats_parent_id_idx ON public.career_stats_stats USING btree (_parent_id);


--
-- Name: career_testimonials_testimonials_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_testimonials_testimonials_image_idx ON public.career_testimonials_testimonials USING btree (image_id);


--
-- Name: career_testimonials_testimonials_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_testimonials_testimonials_order_idx ON public.career_testimonials_testimonials USING btree (_order);


--
-- Name: career_testimonials_testimonials_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_testimonials_testimonials_parent_id_idx ON public.career_testimonials_testimonials USING btree (_parent_id);


--
-- Name: career_work_here_cards_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_work_here_cards_image_idx ON public.career_work_here_cards USING btree (image_id);


--
-- Name: career_work_here_cards_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_work_here_cards_order_idx ON public.career_work_here_cards USING btree (_order);


--
-- Name: career_work_here_cards_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX career_work_here_cards_parent_id_idx ON public.career_work_here_cards USING btree (_parent_id);


--
-- Name: case_studies_challenges_challenge_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_challenges_challenge_items_order_idx ON public.case_studies_challenges_challenge_items USING btree (_order);


--
-- Name: case_studies_challenges_challenge_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_challenges_challenge_items_parent_id_idx ON public.case_studies_challenges_challenge_items USING btree (_parent_id);


--
-- Name: case_studies_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_created_at_idx ON public.case_studies USING btree (created_at);


--
-- Name: case_studies_grid_rels_case_studies_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_grid_rels_case_studies_id_idx ON public.case_studies_grid_rels USING btree (case_studies_id);


--
-- Name: case_studies_grid_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_grid_rels_order_idx ON public.case_studies_grid_rels USING btree ("order");


--
-- Name: case_studies_grid_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_grid_rels_parent_idx ON public.case_studies_grid_rels USING btree (parent_id);


--
-- Name: case_studies_grid_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_grid_rels_path_idx ON public.case_studies_grid_rels USING btree (path);


--
-- Name: case_studies_hero_background_image_1_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_hero_background_image_1_idx ON public.case_studies_hero USING btree (background_image_id);


--
-- Name: case_studies_hero_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_hero_background_image_idx ON public.case_studies USING btree (hero_background_image_id);


--
-- Name: case_studies_hero_logo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_hero_logo_idx ON public.case_studies USING btree (hero_logo_id);


--
-- Name: case_studies_how_n_c_g_helped_solutions_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_how_n_c_g_helped_solutions_image_idx ON public.case_studies_how_n_c_g_helped_solutions USING btree (image_id);


--
-- Name: case_studies_how_n_c_g_helped_solutions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_how_n_c_g_helped_solutions_order_idx ON public.case_studies_how_n_c_g_helped_solutions USING btree (_order);


--
-- Name: case_studies_how_n_c_g_helped_solutions_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_how_n_c_g_helped_solutions_parent_id_idx ON public.case_studies_how_n_c_g_helped_solutions USING btree (_parent_id);


--
-- Name: case_studies_icon_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_icon_idx ON public.case_studies USING btree (icon_id);


--
-- Name: case_studies_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_image_idx ON public.case_studies USING btree (image_id);


--
-- Name: case_studies_page_hero_hero_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_page_hero_hero_background_image_idx ON public.case_studies_page USING btree (hero_background_image_id);


--
-- Name: case_studies_page_rels_case_studies_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_page_rels_case_studies_id_idx ON public.case_studies_page_rels USING btree (case_studies_id);


--
-- Name: case_studies_page_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_page_rels_order_idx ON public.case_studies_page_rels USING btree ("order");


--
-- Name: case_studies_page_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_page_rels_parent_idx ON public.case_studies_page_rels USING btree (parent_id);


--
-- Name: case_studies_page_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_page_rels_path_idx ON public.case_studies_page_rels USING btree (path);


--
-- Name: case_studies_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX case_studies_slug_idx ON public.case_studies USING btree (slug);


--
-- Name: case_studies_solution_tags_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_solution_tags_order_idx ON public.case_studies_solution_tags USING btree (_order);


--
-- Name: case_studies_solution_tags_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_solution_tags_parent_id_idx ON public.case_studies_solution_tags USING btree (_parent_id);


--
-- Name: case_studies_solutions_implemented_solution_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_solutions_implemented_solution_items_order_idx ON public.case_studies_solutions_implemented_solution_items USING btree (_order);


--
-- Name: case_studies_solutions_implemented_solution_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_solutions_implemented_solution_items_parent_id_idx ON public.case_studies_solutions_implemented_solution_items USING btree (_parent_id);


--
-- Name: case_studies_solutions_implemented_solutions_implemented_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_solutions_implemented_solutions_implemented_idx ON public.case_studies USING btree (solutions_implemented_icon_image_id);


--
-- Name: case_studies_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_updated_at_idx ON public.case_studies USING btree (updated_at);


--
-- Name: case_studies_value_delivered_value_cards_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_value_delivered_value_cards_image_idx ON public.case_studies_value_delivered_value_cards USING btree (image_id);


--
-- Name: case_studies_value_delivered_value_cards_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_value_delivered_value_cards_order_idx ON public.case_studies_value_delivered_value_cards USING btree (_order);


--
-- Name: case_studies_value_delivered_value_cards_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX case_studies_value_delivered_value_cards_parent_id_idx ON public.case_studies_value_delivered_value_cards USING btree (_parent_id);


--
-- Name: contact_section_team_member_certifications_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contact_section_team_member_certifications_order_idx ON public.contact_section_team_member_certifications USING btree (_order);


--
-- Name: contact_section_team_member_certifications_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contact_section_team_member_certifications_parent_id_idx ON public.contact_section_team_member_certifications USING btree (_parent_id);


--
-- Name: contact_section_team_member_team_member_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contact_section_team_member_team_member_image_idx ON public.contact_section USING btree (team_member_image_id);


--
-- Name: hero_section_animated_texts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hero_section_animated_texts_order_idx ON public.hero_section_animated_texts USING btree (_order);


--
-- Name: hero_section_animated_texts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hero_section_animated_texts_parent_id_idx ON public.hero_section_animated_texts USING btree (_parent_id);


--
-- Name: hero_section_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hero_section_background_image_idx ON public.hero_section USING btree (background_image_id);


--
-- Name: hero_section_background_images_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hero_section_background_images_image_idx ON public.hero_section_background_images USING btree (image_id);


--
-- Name: hero_section_background_images_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hero_section_background_images_order_idx ON public.hero_section_background_images USING btree (_order);


--
-- Name: hero_section_background_images_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hero_section_background_images_parent_id_idx ON public.hero_section_background_images USING btree (_parent_id);


--
-- Name: icons_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX icons_created_at_idx ON public.icons USING btree (created_at);


--
-- Name: icons_svg_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX icons_svg_idx ON public.icons USING btree (svg_id);


--
-- Name: icons_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX icons_updated_at_idx ON public.icons USING btree (updated_at);


--
-- Name: job_applications_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_created_at_idx ON public.job_applications USING btree (created_at);


--
-- Name: job_applications_job_opening_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_job_opening_idx ON public.job_applications USING btree (job_opening_id);


--
-- Name: job_applications_language_skills_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_language_skills_order_idx ON public.job_applications_language_skills USING btree ("order");


--
-- Name: job_applications_language_skills_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_language_skills_parent_idx ON public.job_applications_language_skills USING btree (parent_id);


--
-- Name: job_applications_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_rels_media_id_idx ON public.job_applications_rels USING btree (media_id);


--
-- Name: job_applications_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_rels_order_idx ON public.job_applications_rels USING btree ("order");


--
-- Name: job_applications_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_rels_parent_idx ON public.job_applications_rels USING btree (parent_id);


--
-- Name: job_applications_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_rels_path_idx ON public.job_applications_rels USING btree (path);


--
-- Name: job_applications_resume_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_resume_idx ON public.job_applications USING btree (resume_id);


--
-- Name: job_applications_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_applications_updated_at_idx ON public.job_applications USING btree (updated_at);


--
-- Name: job_openings_attributes_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_attributes_order_idx ON public.job_openings_attributes USING btree (_order);


--
-- Name: job_openings_attributes_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_attributes_parent_id_idx ON public.job_openings_attributes USING btree (_parent_id);


--
-- Name: job_openings_benefits_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_benefits_order_idx ON public.job_openings_benefits USING btree (_order);


--
-- Name: job_openings_benefits_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_benefits_parent_id_idx ON public.job_openings_benefits USING btree (_parent_id);


--
-- Name: job_openings_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_created_at_idx ON public.job_openings USING btree (created_at);


--
-- Name: job_openings_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_hero_image_idx ON public.job_openings USING btree (hero_image_id);


--
-- Name: job_openings_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_image_idx ON public.job_openings USING btree (image_id);


--
-- Name: job_openings_required_skills_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_required_skills_order_idx ON public.job_openings_required_skills USING btree (_order);


--
-- Name: job_openings_required_skills_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_required_skills_parent_id_idx ON public.job_openings_required_skills USING btree (_parent_id);


--
-- Name: job_openings_responsibilities_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_responsibilities_order_idx ON public.job_openings_responsibilities USING btree (_order);


--
-- Name: job_openings_responsibilities_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_responsibilities_parent_id_idx ON public.job_openings_responsibilities USING btree (_parent_id);


--
-- Name: job_openings_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX job_openings_slug_idx ON public.job_openings USING btree (slug);


--
-- Name: job_openings_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_openings_updated_at_idx ON public.job_openings USING btree (updated_at);


--
-- Name: jobs_section_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_section_background_image_idx ON public.jobs_section USING btree (background_image_id);


--
-- Name: jobs_section_rels_job_openings_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_section_rels_job_openings_id_idx ON public.jobs_section_rels USING btree (job_openings_id);


--
-- Name: jobs_section_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_section_rels_order_idx ON public.jobs_section_rels USING btree ("order");


--
-- Name: jobs_section_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_section_rels_parent_idx ON public.jobs_section_rels USING btree (parent_id);


--
-- Name: jobs_section_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_section_rels_path_idx ON public.jobs_section_rels USING btree (path);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_blogs_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_blogs_id_idx ON public.payload_locked_documents_rels USING btree (blogs_id);


--
-- Name: payload_locked_documents_rels_case_studies_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_case_studies_id_idx ON public.payload_locked_documents_rels USING btree (case_studies_id);


--
-- Name: payload_locked_documents_rels_icons_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_icons_id_idx ON public.payload_locked_documents_rels USING btree (icons_id);


--
-- Name: payload_locked_documents_rels_job_applications_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_job_applications_id_idx ON public.payload_locked_documents_rels USING btree (job_applications_id);


--
-- Name: payload_locked_documents_rels_job_openings_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_job_openings_id_idx ON public.payload_locked_documents_rels USING btree (job_openings_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_services_id_idx ON public.payload_locked_documents_rels USING btree (services_id);


--
-- Name: payload_locked_documents_rels_sub_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_sub_services_id_idx ON public.payload_locked_documents_rels USING btree (sub_services_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: privacy_policy_section_cookies_policy_sections_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX privacy_policy_section_cookies_policy_sections_order_idx ON public.privacy_policy_section_cookies_policy_sections USING btree (_order);


--
-- Name: privacy_policy_section_cookies_policy_sections_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX privacy_policy_section_cookies_policy_sections_parent_id_idx ON public.privacy_policy_section_cookies_policy_sections USING btree (_parent_id);


--
-- Name: privacy_policy_section_hero_hero_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX privacy_policy_section_hero_hero_background_image_idx ON public.privacy_policy_section USING btree (hero_background_image_id);


--
-- Name: privacy_policy_section_privacy_policy_sections_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX privacy_policy_section_privacy_policy_sections_order_idx ON public.privacy_policy_section_privacy_policy_sections USING btree (_order);


--
-- Name: privacy_policy_section_privacy_policy_sections_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX privacy_policy_section_privacy_policy_sections_parent_id_idx ON public.privacy_policy_section_privacy_policy_sections USING btree (_parent_id);


--
-- Name: services_advantages_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_advantages_image_idx ON public.services_advantages USING btree (image_id);


--
-- Name: services_advantages_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_advantages_order_idx ON public.services_advantages USING btree (_order);


--
-- Name: services_advantages_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_advantages_parent_id_idx ON public.services_advantages USING btree (_parent_id);


--
-- Name: services_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_created_at_idx ON public.services USING btree (created_at);


--
-- Name: services_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_hero_image_idx ON public.services USING btree (hero_image_id);


--
-- Name: services_rels_case_studies_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_rels_case_studies_id_idx ON public.services_rels USING btree (case_studies_id);


--
-- Name: services_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_rels_order_idx ON public.services_rels USING btree ("order");


--
-- Name: services_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_rels_parent_idx ON public.services_rels USING btree (parent_id);


--
-- Name: services_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_rels_path_idx ON public.services_rels USING btree (path);


--
-- Name: services_rels_sub_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_rels_sub_services_id_idx ON public.services_rels USING btree (sub_services_id);


--
-- Name: services_section_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_section_rels_order_idx ON public.services_section_rels USING btree ("order");


--
-- Name: services_section_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_section_rels_parent_idx ON public.services_section_rels USING btree (parent_id);


--
-- Name: services_section_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_section_rels_path_idx ON public.services_section_rels USING btree (path);


--
-- Name: services_section_rels_sub_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_section_rels_sub_services_id_idx ON public.services_section_rels USING btree (sub_services_id);


--
-- Name: services_section_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_section_services_order_idx ON public.services_section_services USING btree (_order);


--
-- Name: services_section_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_section_services_parent_id_idx ON public.services_section_services USING btree (_parent_id);


--
-- Name: services_section_services_service_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_section_services_service_idx ON public.services_section_services USING btree (service_id);


--
-- Name: services_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX services_slug_idx ON public.services USING btree (slug);


--
-- Name: services_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_updated_at_idx ON public.services USING btree (updated_at);


--
-- Name: sub_services_advantages_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_advantages_image_idx ON public.sub_services_advantages USING btree (image_id);


--
-- Name: sub_services_advantages_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_advantages_order_idx ON public.sub_services_advantages USING btree (_order);


--
-- Name: sub_services_advantages_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_advantages_parent_id_idx ON public.sub_services_advantages USING btree (_parent_id);


--
-- Name: sub_services_challenges_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_challenges_image_idx ON public.sub_services_challenges USING btree (image_id);


--
-- Name: sub_services_challenges_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_challenges_order_idx ON public.sub_services_challenges USING btree (_order);


--
-- Name: sub_services_challenges_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_challenges_parent_id_idx ON public.sub_services_challenges USING btree (_parent_id);


--
-- Name: sub_services_core_features_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_core_features_image_idx ON public.sub_services USING btree (core_features_image_id);


--
-- Name: sub_services_core_features_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_core_features_order_idx ON public.sub_services_core_features USING btree (_order);


--
-- Name: sub_services_core_features_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_core_features_parent_id_idx ON public.sub_services_core_features USING btree (_parent_id);


--
-- Name: sub_services_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_created_at_idx ON public.sub_services USING btree (created_at);


--
-- Name: sub_services_download_banner_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_download_banner_image_idx ON public.sub_services USING btree (download_banner_image_id);


--
-- Name: sub_services_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_hero_image_idx ON public.sub_services USING btree (hero_image_id);


--
-- Name: sub_services_iga_services_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_iga_services_background_image_idx ON public.sub_services_iga_services USING btree (background_image_id);


--
-- Name: sub_services_iga_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_iga_services_order_idx ON public.sub_services_iga_services USING btree (_order);


--
-- Name: sub_services_iga_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_iga_services_parent_id_idx ON public.sub_services_iga_services USING btree (_parent_id);


--
-- Name: sub_services_importance_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_importance_image_idx ON public.sub_services USING btree (importance_image_id);


--
-- Name: sub_services_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_rels_order_idx ON public.sub_services_rels USING btree ("order");


--
-- Name: sub_services_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_rels_parent_idx ON public.sub_services_rels USING btree (parent_id);


--
-- Name: sub_services_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_rels_path_idx ON public.sub_services_rels USING btree (path);


--
-- Name: sub_services_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_rels_services_id_idx ON public.sub_services_rels USING btree (services_id);


--
-- Name: sub_services_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sub_services_slug_idx ON public.sub_services USING btree (slug);


--
-- Name: sub_services_success_stories_background_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_success_stories_background_image_idx ON public.sub_services USING btree (success_stories_background_image_id);


--
-- Name: sub_services_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sub_services_updated_at_idx ON public.sub_services USING btree (updated_at);


--
-- Name: testimonials_section_testimonials_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX testimonials_section_testimonials_image_idx ON public.testimonials_section_testimonials USING btree (image_id);


--
-- Name: testimonials_section_testimonials_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX testimonials_section_testimonials_order_idx ON public.testimonials_section_testimonials USING btree (_order);


--
-- Name: testimonials_section_testimonials_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX testimonials_section_testimonials_parent_id_idx ON public.testimonials_section_testimonials USING btree (_parent_id);


--
-- Name: trusted_by_section_clients_logo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trusted_by_section_clients_logo_idx ON public.trusted_by_section_clients USING btree (logo_id);


--
-- Name: trusted_by_section_clients_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trusted_by_section_clients_order_idx ON public.trusted_by_section_clients USING btree (_order);


--
-- Name: trusted_by_section_clients_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trusted_by_section_clients_parent_id_idx ON public.trusted_by_section_clients USING btree (_parent_id);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: about_core_values_section_values about_core_values_section_values_icon_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_core_values_section_values
    ADD CONSTRAINT about_core_values_section_values_icon_id_media_id_fk FOREIGN KEY (icon_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: about_core_values_section_values about_core_values_section_values_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_core_values_section_values
    ADD CONSTRAINT about_core_values_section_values_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.about_core_values_section(id) ON DELETE CASCADE;


--
-- Name: about_cta_section about_cta_section_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_cta_section
    ADD CONSTRAINT about_cta_section_background_image_id_media_id_fk FOREIGN KEY (background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: about_hero about_hero_background_video_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_hero
    ADD CONSTRAINT about_hero_background_video_id_media_id_fk FOREIGN KEY (background_video_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: about_stats_section_stats about_stats_section_stats_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_stats_section_stats
    ADD CONSTRAINT about_stats_section_stats_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.about_stats_section(id) ON DELETE CASCADE;


--
-- Name: about_team_section_members about_team_section_members_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_team_section_members
    ADD CONSTRAINT about_team_section_members_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: about_team_section_members about_team_section_members_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_team_section_members
    ADD CONSTRAINT about_team_section_members_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.about_team_section(id) ON DELETE CASCADE;


--
-- Name: about_us_section about_us_section_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_us_section
    ADD CONSTRAINT about_us_section_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: about_us_section_paragraphs about_us_section_paragraphs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_us_section_paragraphs
    ADD CONSTRAINT about_us_section_paragraphs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.about_us_section(id) ON DELETE CASCADE;


--
-- Name: approach_section_steps approach_section_steps_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.approach_section_steps
    ADD CONSTRAINT approach_section_steps_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: approach_section_steps approach_section_steps_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.approach_section_steps
    ADD CONSTRAINT approach_section_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.approach_section(id) ON DELETE CASCADE;


--
-- Name: blogs_content_sections_bullet_items blogs_content_sections_bullet_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_content_sections_bullet_items
    ADD CONSTRAINT blogs_content_sections_bullet_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blogs_content_sections(id) ON DELETE CASCADE;


--
-- Name: blogs_content_sections_numbered_items blogs_content_sections_numbered_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_content_sections_numbered_items
    ADD CONSTRAINT blogs_content_sections_numbered_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blogs_content_sections(id) ON DELETE CASCADE;


--
-- Name: blogs_content_sections_paragraphs blogs_content_sections_paragraphs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_content_sections_paragraphs
    ADD CONSTRAINT blogs_content_sections_paragraphs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blogs_content_sections(id) ON DELETE CASCADE;


--
-- Name: blogs_content_sections blogs_content_sections_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_content_sections
    ADD CONSTRAINT blogs_content_sections_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: blogs_content_sections blogs_content_sections_section_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_content_sections
    ADD CONSTRAINT blogs_content_sections_section_image_id_media_id_fk FOREIGN KEY (section_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: blogs blogs_hero_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_hero_background_image_id_media_id_fk FOREIGN KEY (hero_background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: blogs blogs_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: blogs_page_hero blogs_page_hero_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_page_hero
    ADD CONSTRAINT blogs_page_hero_background_image_id_media_id_fk FOREIGN KEY (background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: career_find_place career_find_place_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_find_place
    ADD CONSTRAINT career_find_place_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: career_find_place_paragraphs career_find_place_paragraphs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_find_place_paragraphs
    ADD CONSTRAINT career_find_place_paragraphs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.career_find_place(id) ON DELETE CASCADE;


--
-- Name: career_hero career_hero_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_hero
    ADD CONSTRAINT career_hero_background_image_id_media_id_fk FOREIGN KEY (background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: career_job_section_rels career_job_section_rels_job_openings_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_job_section_rels
    ADD CONSTRAINT career_job_section_rels_job_openings_fk FOREIGN KEY (job_openings_id) REFERENCES public.job_openings(id) ON DELETE CASCADE;


--
-- Name: career_job_section_rels career_job_section_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_job_section_rels
    ADD CONSTRAINT career_job_section_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.career_job_section(id) ON DELETE CASCADE;


--
-- Name: career_life_at_ncg_images career_life_at_ncg_images_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_life_at_ncg_images
    ADD CONSTRAINT career_life_at_ncg_images_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: career_life_at_ncg_images career_life_at_ncg_images_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_life_at_ncg_images
    ADD CONSTRAINT career_life_at_ncg_images_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.career_life_at_ncg(id) ON DELETE CASCADE;


--
-- Name: career_spotify career_spotify_icon_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_spotify
    ADD CONSTRAINT career_spotify_icon_id_media_id_fk FOREIGN KEY (icon_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: career_stats_stats career_stats_stats_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_stats_stats
    ADD CONSTRAINT career_stats_stats_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.career_stats(id) ON DELETE CASCADE;


--
-- Name: career_testimonials_testimonials career_testimonials_testimonials_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_testimonials_testimonials
    ADD CONSTRAINT career_testimonials_testimonials_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: career_testimonials_testimonials career_testimonials_testimonials_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_testimonials_testimonials
    ADD CONSTRAINT career_testimonials_testimonials_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.career_testimonials(id) ON DELETE CASCADE;


--
-- Name: career_work_here_cards career_work_here_cards_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_work_here_cards
    ADD CONSTRAINT career_work_here_cards_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: career_work_here_cards career_work_here_cards_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_work_here_cards
    ADD CONSTRAINT career_work_here_cards_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.career_work_here(id) ON DELETE CASCADE;


--
-- Name: case_studies_challenges_challenge_items case_studies_challenges_challenge_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_challenges_challenge_items
    ADD CONSTRAINT case_studies_challenges_challenge_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.case_studies(id) ON DELETE CASCADE;


--
-- Name: case_studies_grid_rels case_studies_grid_rels_case_studies_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_grid_rels
    ADD CONSTRAINT case_studies_grid_rels_case_studies_fk FOREIGN KEY (case_studies_id) REFERENCES public.case_studies(id) ON DELETE CASCADE;


--
-- Name: case_studies_grid_rels case_studies_grid_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_grid_rels
    ADD CONSTRAINT case_studies_grid_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.case_studies_grid(id) ON DELETE CASCADE;


--
-- Name: case_studies case_studies_hero_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT case_studies_hero_background_image_id_media_id_fk FOREIGN KEY (hero_background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: case_studies_hero case_studies_hero_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_hero
    ADD CONSTRAINT case_studies_hero_background_image_id_media_id_fk FOREIGN KEY (background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: case_studies case_studies_hero_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT case_studies_hero_logo_id_media_id_fk FOREIGN KEY (hero_logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: case_studies_how_n_c_g_helped_solutions case_studies_how_n_c_g_helped_solutions_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_how_n_c_g_helped_solutions
    ADD CONSTRAINT case_studies_how_n_c_g_helped_solutions_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: case_studies_how_n_c_g_helped_solutions case_studies_how_n_c_g_helped_solutions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_how_n_c_g_helped_solutions
    ADD CONSTRAINT case_studies_how_n_c_g_helped_solutions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.case_studies(id) ON DELETE CASCADE;


--
-- Name: case_studies case_studies_icon_id_icons_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT case_studies_icon_id_icons_id_fk FOREIGN KEY (icon_id) REFERENCES public.icons(id) ON DELETE SET NULL;


--
-- Name: case_studies case_studies_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT case_studies_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: case_studies_page case_studies_page_hero_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_page
    ADD CONSTRAINT case_studies_page_hero_background_image_id_media_id_fk FOREIGN KEY (hero_background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: case_studies_page_rels case_studies_page_rels_case_studies_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_page_rels
    ADD CONSTRAINT case_studies_page_rels_case_studies_fk FOREIGN KEY (case_studies_id) REFERENCES public.case_studies(id) ON DELETE CASCADE;


--
-- Name: case_studies_page_rels case_studies_page_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_page_rels
    ADD CONSTRAINT case_studies_page_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.case_studies_page(id) ON DELETE CASCADE;


--
-- Name: case_studies_solution_tags case_studies_solution_tags_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_solution_tags
    ADD CONSTRAINT case_studies_solution_tags_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.case_studies(id) ON DELETE CASCADE;


--
-- Name: case_studies case_studies_solutions_implemented_icon_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT case_studies_solutions_implemented_icon_image_id_media_id_fk FOREIGN KEY (solutions_implemented_icon_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: case_studies_solutions_implemented_solution_items case_studies_solutions_implemented_solution_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_solutions_implemented_solution_items
    ADD CONSTRAINT case_studies_solutions_implemented_solution_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.case_studies(id) ON DELETE CASCADE;


--
-- Name: case_studies_value_delivered_value_cards case_studies_value_delivered_value_cards_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_value_delivered_value_cards
    ADD CONSTRAINT case_studies_value_delivered_value_cards_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: case_studies_value_delivered_value_cards case_studies_value_delivered_value_cards_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies_value_delivered_value_cards
    ADD CONSTRAINT case_studies_value_delivered_value_cards_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.case_studies(id) ON DELETE CASCADE;


--
-- Name: contact_section_team_member_certifications contact_section_team_member_certifications_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_section_team_member_certifications
    ADD CONSTRAINT contact_section_team_member_certifications_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.contact_section(id) ON DELETE CASCADE;


--
-- Name: contact_section contact_section_team_member_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_section
    ADD CONSTRAINT contact_section_team_member_image_id_media_id_fk FOREIGN KEY (team_member_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: hero_section_animated_texts hero_section_animated_texts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_section_animated_texts
    ADD CONSTRAINT hero_section_animated_texts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.hero_section(id) ON DELETE CASCADE;


--
-- Name: hero_section hero_section_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_section
    ADD CONSTRAINT hero_section_background_image_id_media_id_fk FOREIGN KEY (background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: hero_section_background_images hero_section_background_images_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_section_background_images
    ADD CONSTRAINT hero_section_background_images_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: hero_section_background_images hero_section_background_images_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_section_background_images
    ADD CONSTRAINT hero_section_background_images_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.hero_section(id) ON DELETE CASCADE;


--
-- Name: icons icons_svg_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.icons
    ADD CONSTRAINT icons_svg_id_media_id_fk FOREIGN KEY (svg_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: job_applications job_applications_job_opening_id_job_openings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_opening_id_job_openings_id_fk FOREIGN KEY (job_opening_id) REFERENCES public.job_openings(id) ON DELETE SET NULL;


--
-- Name: job_applications_language_skills job_applications_language_skills_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications_language_skills
    ADD CONSTRAINT job_applications_language_skills_parent_fk FOREIGN KEY (parent_id) REFERENCES public.job_applications(id) ON DELETE CASCADE;


--
-- Name: job_applications_rels job_applications_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications_rels
    ADD CONSTRAINT job_applications_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: job_applications_rels job_applications_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications_rels
    ADD CONSTRAINT job_applications_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.job_applications(id) ON DELETE CASCADE;


--
-- Name: job_applications job_applications_resume_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_resume_id_media_id_fk FOREIGN KEY (resume_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: job_openings_attributes job_openings_attributes_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings_attributes
    ADD CONSTRAINT job_openings_attributes_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.job_openings(id) ON DELETE CASCADE;


--
-- Name: job_openings_benefits job_openings_benefits_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings_benefits
    ADD CONSTRAINT job_openings_benefits_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.job_openings(id) ON DELETE CASCADE;


--
-- Name: job_openings job_openings_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings
    ADD CONSTRAINT job_openings_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: job_openings job_openings_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings
    ADD CONSTRAINT job_openings_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: job_openings_required_skills job_openings_required_skills_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings_required_skills
    ADD CONSTRAINT job_openings_required_skills_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.job_openings(id) ON DELETE CASCADE;


--
-- Name: job_openings_responsibilities job_openings_responsibilities_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_openings_responsibilities
    ADD CONSTRAINT job_openings_responsibilities_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.job_openings(id) ON DELETE CASCADE;


--
-- Name: jobs_section jobs_section_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_section
    ADD CONSTRAINT jobs_section_background_image_id_media_id_fk FOREIGN KEY (background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: jobs_section_rels jobs_section_rels_job_openings_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_section_rels
    ADD CONSTRAINT jobs_section_rels_job_openings_fk FOREIGN KEY (job_openings_id) REFERENCES public.job_openings(id) ON DELETE CASCADE;


--
-- Name: jobs_section_rels jobs_section_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_section_rels
    ADD CONSTRAINT jobs_section_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.jobs_section(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_blogs_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_blogs_fk FOREIGN KEY (blogs_id) REFERENCES public.blogs(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_case_studies_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_case_studies_fk FOREIGN KEY (case_studies_id) REFERENCES public.case_studies(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_icons_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_icons_fk FOREIGN KEY (icons_id) REFERENCES public.icons(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_job_applications_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_job_applications_fk FOREIGN KEY (job_applications_id) REFERENCES public.job_applications(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_job_openings_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_job_openings_fk FOREIGN KEY (job_openings_id) REFERENCES public.job_openings(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_sub_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_sub_services_fk FOREIGN KEY (sub_services_id) REFERENCES public.sub_services(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: privacy_policy_section_cookies_policy_sections privacy_policy_section_cookies_policy_sections_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.privacy_policy_section_cookies_policy_sections
    ADD CONSTRAINT privacy_policy_section_cookies_policy_sections_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.privacy_policy_section(id) ON DELETE CASCADE;


--
-- Name: privacy_policy_section privacy_policy_section_hero_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.privacy_policy_section
    ADD CONSTRAINT privacy_policy_section_hero_background_image_id_media_id_fk FOREIGN KEY (hero_background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: privacy_policy_section_privacy_policy_sections privacy_policy_section_privacy_policy_sections_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.privacy_policy_section_privacy_policy_sections
    ADD CONSTRAINT privacy_policy_section_privacy_policy_sections_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.privacy_policy_section(id) ON DELETE CASCADE;


--
-- Name: services_advantages services_advantages_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_advantages
    ADD CONSTRAINT services_advantages_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: services_advantages services_advantages_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_advantages
    ADD CONSTRAINT services_advantages_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services services_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: services_rels services_rels_case_studies_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_rels
    ADD CONSTRAINT services_rels_case_studies_fk FOREIGN KEY (case_studies_id) REFERENCES public.case_studies(id) ON DELETE CASCADE;


--
-- Name: services_rels services_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_rels
    ADD CONSTRAINT services_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_rels services_rels_sub_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_rels
    ADD CONSTRAINT services_rels_sub_services_fk FOREIGN KEY (sub_services_id) REFERENCES public.sub_services(id) ON DELETE CASCADE;


--
-- Name: services_section_rels services_section_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_section_rels
    ADD CONSTRAINT services_section_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.services_section(id) ON DELETE CASCADE;


--
-- Name: services_section_rels services_section_rels_sub_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_section_rels
    ADD CONSTRAINT services_section_rels_sub_services_fk FOREIGN KEY (sub_services_id) REFERENCES public.sub_services(id) ON DELETE CASCADE;


--
-- Name: services_section_services services_section_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_section_services
    ADD CONSTRAINT services_section_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_section(id) ON DELETE CASCADE;


--
-- Name: services_section_services services_section_services_service_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_section_services
    ADD CONSTRAINT services_section_services_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: sub_services_advantages sub_services_advantages_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_advantages
    ADD CONSTRAINT sub_services_advantages_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: sub_services_advantages sub_services_advantages_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_advantages
    ADD CONSTRAINT sub_services_advantages_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.sub_services(id) ON DELETE CASCADE;


--
-- Name: sub_services_challenges sub_services_challenges_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_challenges
    ADD CONSTRAINT sub_services_challenges_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: sub_services_challenges sub_services_challenges_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_challenges
    ADD CONSTRAINT sub_services_challenges_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.sub_services(id) ON DELETE CASCADE;


--
-- Name: sub_services sub_services_core_features_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services
    ADD CONSTRAINT sub_services_core_features_image_id_media_id_fk FOREIGN KEY (core_features_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: sub_services_core_features sub_services_core_features_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_core_features
    ADD CONSTRAINT sub_services_core_features_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.sub_services(id) ON DELETE CASCADE;


--
-- Name: sub_services sub_services_download_banner_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services
    ADD CONSTRAINT sub_services_download_banner_image_id_media_id_fk FOREIGN KEY (download_banner_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: sub_services sub_services_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services
    ADD CONSTRAINT sub_services_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: sub_services_iga_services sub_services_iga_services_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_iga_services
    ADD CONSTRAINT sub_services_iga_services_background_image_id_media_id_fk FOREIGN KEY (background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: sub_services_iga_services sub_services_iga_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_iga_services
    ADD CONSTRAINT sub_services_iga_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.sub_services(id) ON DELETE CASCADE;


--
-- Name: sub_services sub_services_importance_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services
    ADD CONSTRAINT sub_services_importance_image_id_media_id_fk FOREIGN KEY (importance_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: sub_services_rels sub_services_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_rels
    ADD CONSTRAINT sub_services_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.sub_services(id) ON DELETE CASCADE;


--
-- Name: sub_services_rels sub_services_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services_rels
    ADD CONSTRAINT sub_services_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: sub_services sub_services_success_stories_background_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_services
    ADD CONSTRAINT sub_services_success_stories_background_image_id_media_id_fk FOREIGN KEY (success_stories_background_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: testimonials_section_testimonials testimonials_section_testimonials_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials_section_testimonials
    ADD CONSTRAINT testimonials_section_testimonials_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: testimonials_section_testimonials testimonials_section_testimonials_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials_section_testimonials
    ADD CONSTRAINT testimonials_section_testimonials_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.testimonials_section(id) ON DELETE CASCADE;


--
-- Name: trusted_by_section_clients trusted_by_section_clients_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trusted_by_section_clients
    ADD CONSTRAINT trusted_by_section_clients_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: trusted_by_section_clients trusted_by_section_clients_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trusted_by_section_clients
    ADD CONSTRAINT trusted_by_section_clients_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.trusted_by_section(id) ON DELETE CASCADE;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict kpQKEtdRCdoGlcXU6rYgAMQcuo23izpvmJsTKcqCBMYFXKWowu4Oage7eg9MbMV

