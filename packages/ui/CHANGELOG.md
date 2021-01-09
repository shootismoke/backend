# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.6.2](https://github.com/shootismoke/common/compare/v0.6.1...v0.6.2) (2020-10-31)


### Features

* **ui:** Export `slugify` function ([#336](https://github.com/shootismoke/common/issues/336)) ([d1eeab4](https://github.com/shootismoke/common/commit/d1eeab4cf73d74ed84c58f2210ff731f9c7f4103))





## [0.6.1](https://github.com/shootismoke/common/compare/v0.6.0...v0.6.1) (2020-10-22)


### Bug Fixes

* **ui:** Remove negative values ([#328](https://github.com/shootismoke/common/issues/328)) ([b613992](https://github.com/shootismoke/common/commit/b6139926e0cbb153e386aaf4e52b54ba85c36fa3))





# [0.6.0](https://github.com/shootismoke/common/compare/v0.5.7...v0.6.0) (2020-10-22)


### Bug Fixes

* **ui:** Remove CigarettesBlock, CigarettesText and ConversionBox  ([#313](https://github.com/shootismoke/common/issues/313)) ([6631fae](https://github.com/shootismoke/common/commit/6631faee3317e8ad797db6556cbb7943f676e500))
* **ui:** Remove measurements with negative value ([#327](https://github.com/shootismoke/common/issues/327)) ([8ed2f95](https://github.com/shootismoke/common/commit/8ed2f95f90b924ee4e536c0cc7c1c006096f63ed))


### BREAKING CHANGES

* **ui:** The component `CigarettesBlock`, `CigarettesText` and `ConversionBox` have been removed from the ui package.





## [0.5.7](https://github.com/shootismoke/common/compare/v0.5.6...v0.5.7) (2020-10-18)


### Bug Fixes

* **dataproviders:** Use https for AQICN ([#321](https://github.com/shootismoke/common/issues/321)) ([1028ee7](https://github.com/shootismoke/common/commit/1028ee7f0dbec5b2a3527859de45a772a7ce1f53))





## [0.5.6](https://github.com/shootismoke/common/compare/v0.5.5...v0.5.6) (2020-10-18)

**Note:** Version bump only for package @shootismoke/ui





## [0.5.5](https://github.com/shootismoke/common/compare/v0.5.4...v0.5.5) (2020-10-17)


### Bug Fixes

* **ui:** Filter out old data in Normalized ([#319](https://github.com/shootismoke/common/issues/319)) ([385fac3](https://github.com/shootismoke/common/commit/385fac33f83b18760299ad0b45bd2a5ab5c41e05))





## [0.5.4](https://github.com/shootismoke/common/compare/v0.5.3...v0.5.4) (2020-10-16)


### Bug Fixes

* **ui:** Use promise in raceApi ([#318](https://github.com/shootismoke/common/issues/318)) ([50e6bfc](https://github.com/shootismoke/common/commit/50e6bfcaf67502b1f0c28b2bca3b519aa21c04ca))





## [0.5.3](https://github.com/shootismoke/common/compare/v0.5.2...v0.5.3) (2020-10-16)


### Bug Fixes

* **ui:** Difference in hours absolute should be smaller than 6 ([#317](https://github.com/shootismoke/common/issues/317)) ([f09b36f](https://github.com/shootismoke/common/commit/f09b36fdee3704ce298ea45656628b8bec6ecc3b))





## [0.5.2](https://github.com/shootismoke/common/compare/v0.5.1...v0.5.2) (2020-10-16)


### Bug Fixes

* **ui:** raceApiPromise only return recent results ([#316](https://github.com/shootismoke/common/issues/316)) ([1176a83](https://github.com/shootismoke/common/commit/1176a83e51ed3b701b3ccdf7ee3dc2d490e673c4))





## [0.5.1](https://github.com/shootismoke/common/compare/v0.5.0...v0.5.1) (2020-10-15)

**Note:** Version bump only for package @shootismoke/ui





# [0.5.0](https://github.com/shootismoke/common/compare/v0.4.0...v0.5.0) (2020-10-15)


### Features

* Add isAccurate field on API ([#315](https://github.com/shootismoke/common/issues/315)) ([e35acd7](https://github.com/shootismoke/common/commit/e35acd7df05bb5b6ec33b4d490c777d39ff69ca0))


### BREAKING CHANGES

* `isStationToFar` and `distanceToStation` now take a PM2.5 measurement `OpenAQFormat` object, instead of the Api object.





# [0.4.0](https://github.com/shootismoke/common/compare/v0.3.1...v0.4.0) (2020-10-13)


### Bug Fixes

* **ui:** Allow aqicn & openaq options in race ([#314](https://github.com/shootismoke/common/issues/314)) ([6226962](https://github.com/shootismoke/common/commit/62269629559fc3db6fc76cde16a9570cb645d81d))


### BREAKING CHANGES

* **ui:** The raceApiPromise function's 2nd argument, RaceApiOptions, now is an object with 2 optional fields: aqicn and openaq, where each field represents the options to pass down to the respective dataprovider.





## [0.3.1](https://github.com/shootismoke/common/compare/v0.3.0...v0.3.1) (2020-10-11)

**Note:** Version bump only for package @shootismoke/ui





# [0.3.0](https://github.com/shootismoke/common/compare/v0.2.32...v0.3.0) (2020-10-10)


### Features

* Update icons and remove Gotham ([#304](https://github.com/shootismoke/common/issues/304)) ([d3f804e](https://github.com/shootismoke/common/commit/d3f804e65ed2b796614282bf2fe6e9aa5b05fc9b))





## [0.2.32](https://github.com/shootismoke/common/compare/v0.2.31...v0.2.32) (2020-10-04)


### Features

* Add custom styling of inner button ([#296](https://github.com/shootismoke/common/issues/296)) ([ef57322](https://github.com/shootismoke/common/commit/ef573225edbf24b47637ae906e8d45804e171d74))





## [0.2.30](https://github.com/shootismoke/common/compare/v0.2.29...v0.2.30) (2020-06-09)


### Bug Fixes

* **ui:** Fix styles TS typings ([baa7021](https://github.com/shootismoke/common/commit/baa70219ef6d14889c7b26ccc1f87488ad56887b))





## [0.2.29](https://github.com/shootismoke/common/compare/v0.2.28...v0.2.29) (2020-06-09)


### Bug Fixes

* **ui:** Add cigarettes customization ([#194](https://github.com/shootismoke/common/issues/194)) ([3eb4693](https://github.com/shootismoke/common/commit/3eb469301707b7ceef8f50a86c84b6df58690029))





## [0.2.28](https://github.com/shootismoke/common/compare/v0.2.27...v0.2.28) (2020-06-05)

**Note:** Version bump only for package @shootismoke/ui





## [0.2.27](https://github.com/shootismoke/common/compare/v0.2.26...v0.2.27) (2020-06-05)


### Features

* Add functions to ui, fix fetchByGps in dataproviders ([#183](https://github.com/shootismoke/common/issues/183)) ([6678714](https://github.com/shootismoke/common/commit/6678714d432d20b31e48e82ed07d12ce59dbcddc))





## [0.2.26](https://github.com/shootismoke/common/compare/v0.2.25...v0.2.26) (2020-06-03)


### Bug Fixes

* **ui:** Add better props for Cigarettes ([#182](https://github.com/shootismoke/common/issues/182)) ([834b1a8](https://github.com/shootismoke/common/commit/834b1a8d310148ec56c9e4c41ae8173b2f805018))


### Features

* **ui:** Add more functions to ui ([#181](https://github.com/shootismoke/common/issues/181)) ([29821f9](https://github.com/shootismoke/common/commit/29821f917313c491b92b655bb84120f2dd48f8ac))





## [0.2.25](https://github.com/shootismoke/common/compare/v0.2.24...v0.2.25) (2020-06-02)

**Note:** Version bump only for package @shootismoke/ui





## [0.2.24](https://github.com/shootismoke/common/compare/v0.2.23...v0.2.24) (2020-06-02)


### Features

* **ui:** Add a @shootismoke/ui package ([#179](https://github.com/shootismoke/common/issues/179)) ([07958c4](https://github.com/shootismoke/common/commit/07958c470a9290efb550db05784bf7e223cc77ff))
