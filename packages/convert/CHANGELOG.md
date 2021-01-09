# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.6.1](https://github.com/shootismoke/common/compare/v0.6.0...v0.6.1) (2020-10-22)


### Bug Fixes

* **ui:** Remove negative values ([#328](https://github.com/shootismoke/common/issues/328)) ([b613992](https://github.com/shootismoke/common/commit/b6139926e0cbb153e386aaf4e52b54ba85c36fa3))





# [0.6.0](https://github.com/shootismoke/common/compare/v0.5.7...v0.6.0) (2020-10-22)

**Note:** Version bump only for package @shootismoke/convert





## [0.5.7](https://github.com/shootismoke/common/compare/v0.5.6...v0.5.7) (2020-10-18)


### Bug Fixes

* **dataproviders:** Use https for AQICN ([#321](https://github.com/shootismoke/common/issues/321)) ([1028ee7](https://github.com/shootismoke/common/commit/1028ee7f0dbec5b2a3527859de45a772a7ce1f53))





## [0.5.4](https://github.com/shootismoke/common/compare/v0.5.3...v0.5.4) (2020-10-16)


### Bug Fixes

* **ui:** Use promise in raceApi ([#318](https://github.com/shootismoke/common/issues/318)) ([50e6bfc](https://github.com/shootismoke/common/commit/50e6bfcaf67502b1f0c28b2bca3b519aa21c04ca))





## [0.5.1](https://github.com/shootismoke/common/compare/v0.5.0...v0.5.1) (2020-10-15)

**Note:** Version bump only for package @shootismoke/convert





# [0.5.0](https://github.com/shootismoke/common/compare/v0.4.0...v0.5.0) (2020-10-15)

**Note:** Version bump only for package @shootismoke/convert





# [0.4.0](https://github.com/shootismoke/common/compare/v0.3.1...v0.4.0) (2020-10-13)

**Note:** Version bump only for package @shootismoke/convert





## [0.3.1](https://github.com/shootismoke/common/compare/v0.3.0...v0.3.1) (2020-10-11)


### Features

* Add Black Carbon pollutant ([#305](https://github.com/shootismoke/common/issues/305)) ([6a21aab](https://github.com/shootismoke/common/commit/6a21aab4f6f3b9174b26e5585b1e708b8c65f3c3))





# [0.3.0](https://github.com/shootismoke/common/compare/v0.2.32...v0.3.0) (2020-10-10)

**Note:** Version bump only for package @shootismoke/convert





## [0.2.28](https://github.com/shootismoke/common/compare/v0.2.27...v0.2.28) (2020-06-05)

**Note:** Version bump only for package @shootismoke/convert





## [0.2.25](https://github.com/shootismoke/common/compare/v0.2.24...v0.2.25) (2020-06-02)

**Note:** Version bump only for package @shootismoke/convert





## [0.2.24](https://github.com/shootismoke/common/compare/v0.2.23...v0.2.24) (2020-06-02)


### Features

* **ui:** Add a @shootismoke/ui package ([#179](https://github.com/shootismoke/common/issues/179)) ([07958c4](https://github.com/shootismoke/common/commit/07958c470a9290efb550db05784bf7e223cc77ff))





## [0.2.8](https://github.com/shootismoke/common/compare/v0.2.7...v0.2.8) (2020-01-28)


### Bug Fixes

* **dataproviders:** Add correct options to openaq fetch ([#69](https://github.com/shootismoke/common/issues/69)) ([e2589eb](https://github.com/shootismoke/common/commit/e2589eb10cdea861384d0f55c2e05f439d1055d7))





## [0.2.7](https://github.com/shootismoke/common/compare/v0.2.6...v0.2.7) (2020-01-20)


### Bug Fixes

* **convert:** Correct Conversion of o3 ([#49](https://github.com/shootismoke/common/issues/49)) ([3dc9877](https://github.com/shootismoke/common/commit/3dc98778e4e2ef824f942eaa398a908ecd428316))





## [0.2.6](https://github.com/shootismoke/common/compare/v0.2.5...v0.2.6) (2020-01-05)


### Bug Fixes

* Export All{Providers, Pollutants, Units} ([#31](https://github.com/shootismoke/common/issues/31)) ([12a061b](https://github.com/shootismoke/common/commit/12a061ba0b892719efbf4fa66033ea61b4288bce))





## [0.2.5](https://github.com/shootismoke/common/compare/v0.2.4...v0.2.5) (2020-01-05)


### Bug Fixes

* **convert:** Export AllUnits from convert ([#26](https://github.com/shootismoke/common/issues/26)) ([31d787d](https://github.com/shootismoke/common/commit/31d787d0d2d9974a2f09076f9d0611dcfa2888eb))
* **graphql:** Re-export graphql schemas as frontend need them ([#27](https://github.com/shootismoke/common/issues/27)) ([64dfd6c](https://github.com/shootismoke/common/commit/64dfd6ccb3b8221a9d0f3a947f40245900469fde))





# [0.2.0](https://github.com/shootismoke/common/compare/v0.1.17...v0.2.0) (2019-12-22)


### Code Refactoring

* **convert:** Move `aqi` to `convert` package ([#13](https://github.com/shootismoke/common/issues/13)) ([e6cbf0b](https://github.com/shootismoke/common/commit/e6cbf0bde8a551dc809448c8d8d292db81ce6e98))
* **dataproviders:** Use Open AQ format ([#17](https://github.com/shootismoke/common/issues/17)) ([9363a95](https://github.com/shootismoke/common/commit/9363a954f26f9e013fd3222aac305c6f664208e5))


### Features

* **convert:** Add breakpoints for co,no2,so2,pm10,o3 for EPA and MEP ([#18](https://github.com/shootismoke/common/issues/18)) ([5e67d25](https://github.com/shootismoke/common/commit/5e67d252496312d2a5b939bf4032674262cef11e))


### BREAKING CHANGES

* **dataproviders:** All data provider fetches return normalized results using the [`openaq-data-format`](https://github.com/openaq/openaq-data-format)
* **convert:** The `@shootismoke/aqi` package has been renamed to `@shootismoke/convert`





## [0.1.15](https://github.com/shootismoke/backend/compare/v0.1.14...v0.1.15) (2019-11-16)


### Bug Fixes

* Fix TS import paths ([#33](https://github.com/shootismoke/backend/issues/33)) ([48fb2a6](https://github.com/shootismoke/backend/commit/48fb2a6af989a9295518383710f9b55661e7f401))





## [0.1.14](https://github.com/shootismoke/backend/compare/v0.1.13...v0.1.14) (2019-11-14)


### Bug Fixes

* Fix package.json main field ([#32](https://github.com/shootismoke/backend/issues/32)) ([f4be4c2](https://github.com/shootismoke/backend/commit/f4be4c25824c3256407bb309cb37a8dd8e51f1b5))





## [0.1.13](https://github.com/shootismoke/backend/compare/v0.1.12...v0.1.13) (2019-11-14)


### Bug Fixes

* Fix paths for imports ([#31](https://github.com/shootismoke/backend/issues/31)) ([ef702e7](https://github.com/shootismoke/backend/commit/ef702e7f195c6abfd2c402aad3736e6ab6145688))





## [0.1.11](https://github.com/shootismoke/backend/compare/v0.1.10...v0.1.11) (2019-11-14)


### Bug Fixes

* **dataproviders:** Change normalized format ([#29](https://github.com/shootismoke/backend/issues/29)) ([e8f50a5](https://github.com/shootismoke/backend/commit/e8f50a527ed1a84852c462fd1dfe14c9fe08e319))





## [0.1.9](https://github.com/shootismoke/backend/compare/v0.1.8...v0.1.9) (2019-11-13)

**Note:** Version bump only for package @shootismoke/aqi





## [0.1.6](https://github.com/shootismoke/backend/compare/v0.1.5...v0.1.6) (2019-11-10)

**Note:** Version bump only for package @shootismoke/aqi
