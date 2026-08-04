package com.logger.logify.repository;

import com.logger.logify.entity.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SettingsRepository extends JpaRepository<Settings, Long> {

    Optional<Settings> findBySettingKey(String settingKey);
}
