"use client";

import VerifiedBadge from "./VerifiedBadge";
import { findClassIcon, findUniqueClassIcon, formatClassText } from "@/lib/dnf-classes";

function avatarPublicUrl(r2Key) {
  if (!r2Key) return null;
  if (/^https?:\/\//i.test(r2Key)) return r2Key;
  return `https://api.dnfm.kr/uploads/r2/${encodeURIComponent(r2Key)}`;
}

/**
 * 게시글 / 콘테스트 본문 끝에 들어가는 작성자 정보 카드.
 *
 * 사용 예: 게시글 상세 페이지 본문 아래.
 *   <AuthorCard
 *     author={{ displayName, dnfProfile, verified }}
 *   />
 *
 * 디자인 ref: 던파 모바일 공식 게시판 (dnfm.nexon.com) 의 본문 끝 카드.
 *   닉네임 → 대표 캐릭터(이름/직업) → 모험단(이름/레벨) → 보유 캐릭 N개 (옵션).
 *
 * 정책:
 *   - 항마력 / 길드 / 서버 / 레벨 표시 X (사용자 정책: 항마력 수집 X + 게시판 노출 정보 최소화).
 *   - 인증 마크는 verifiedBySelectScreen=true 만.
 *   - dnfProfile 비어 있으면 닉네임만.
 */
export default function AuthorCard({ author }) {
  if (!author) return null;
  const displayName = author.displayName || "(닉네임 없음)";
  const dnf = author.dnfProfile || {};
  const verified = !!dnf.verifiedBySelectScreen;
  const main = dnf.mainCharacterName;
  const klass = dnf.mainCharacterClass;
  const mainClassGroup = dnf.mainCharacterClassGroup;
  const adv = dnf.adventurerName;
  const characters = Array.isArray(dnf.characters) ? dnf.characters : [];
  const avatarUrl = avatarPublicUrl(author.avatarR2Key);
  const mainIcon = findClassIcon(mainClassGroup, klass) || findUniqueClassIcon(klass);
  const subCharacters = characters.filter((c) => c?.name && c.name !== main);

  return (
    <aside className="author-card" aria-label={`작성자 ${displayName} 정보`}>
      <div className="author-card__identity">
        <span className="author-card__avatar" aria-hidden="true">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" />
          ) : (
            displayName?.[0] || "?"
          )}
        </span>
        <div className="author-card__head">
          <span className="author-card__nick">{displayName}</span>
          <VerifiedBadge verified={verified} size="md" />
          <span className="author-card__sub">님의</span>
        </div>
      </div>

      {main || adv ? (
        <div className="author-card__body">
          {main ? (
            <div className="author-card__main">
              <span className="author-card__portrait" aria-hidden="true">
                {mainIcon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mainIcon} alt="" />
                ) : null}
              </span>
              <span className="author-card__main-copy">
                <span className="author-card__label">대표 캐릭터</span>
                <strong>{main}</strong>
                {klass ? <em>{formatClassText(mainClassGroup, klass)}</em> : null}
              </span>
            </div>
          ) : null}
          {adv ? (
            <div className="author-card__row">
              <span className="author-card__label">모험단</span>
              <span className="author-card__value">{adv}</span>
            </div>
          ) : null}
          {subCharacters.length > 0 ? (
            <div className="author-card__row">
              <span className="author-card__label">부캐</span>
              <span className="author-card__value author-card__value--list">
                {subCharacters.slice(0, 12).map((c, i) => {
                  const icon = findClassIcon(c.classGroup, c.klass) || findUniqueClassIcon(c.klass);
                  return (
                  <span key={i} className="author-card__chip">
                    {icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={icon} alt="" aria-hidden="true" />
                    ) : null}
                    {c.name}
                    {c.klass ? <em> · {formatClassText(c.classGroup, c.klass)}</em> : null}
                  </span>
                  );
                })}
                {subCharacters.length > 12 ? (
                  <span className="author-card__more">+{subCharacters.length - 12}</span>
                ) : null}
              </span>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="author-card__body author-card__body--empty">
          모험단 인증 정보 없음
        </div>
      )}
    </aside>
  );
}
